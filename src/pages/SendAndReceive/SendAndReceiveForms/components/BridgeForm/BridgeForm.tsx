import { ChainName } from '@interlay/bridge';
import { newMonetaryAmount } from '@interlay/interbtc-api';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { mergeProps } from '@react-aria/utils';
import { ChangeEventHandler, Key, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, newSafeMonetaryAmount } from '@/common/utils/utils';
import { Flex, LoadingSpinner, TokenInput } from '@/component-library';
import {
  AccountSelect,
  AuthCTA,
  TransactionDetails,
  TransactionDetailsDd,
  TransactionDetailsDt,
  TransactionDetailsGroup
} from '@/components';
import { useGetCurrencies } from '@/hooks/api/use-get-currencies';
import { useGetPrices } from '@/hooks/api/use-get-prices';
import { useXCMBridge, XCMTokenData } from '@/hooks/api/xcm/use-xcm-bridge';
import { Transaction, useTransaction } from '@/hooks/transaction';
import useAccountId from '@/hooks/use-account-id';
import {
  BRIDGE_AMOUNT_FIELD,
  BRIDGE_FROM_FIELD,
  BRIDGE_TO_ACCOUNT_FIELD,
  BRIDGE_TO_FIELD,
  BRIDGE_TOKEN_FIELD,
  BridgeFormData,
  bridgeSchema,
  BridgeValidationParams,
  isFormDisabled,
  useForm
} from '@/lib/form';
import { useSubstrateSecureState } from '@/lib/substrate';
import { ChainData, Chains } from '@/types/chains';
import { getTokenPrice } from '@/utils/helpers/prices';
import { findWallet } from '@/utils/helpers/wallet';

import { ChainSelect } from '../ChainSelect';
import { ChainSelectSection, StyledArrowRightCircle, StyledSourceChainSelect } from './BridgeForm.styles';

const BridgeForm = (): JSX.Element => {
  const [destinationChains, setDestinationChains] = useState<Chains>([]);
  const [transferableTokens, setTransferableTokens] = useState<XCMTokenData[]>([]);
  const [currentToken, setCurrentToken] = useState<XCMTokenData>();

  const prices = useGetPrices();
  const { t } = useTranslation();
  const { getCurrencyFromTicker } = useGetCurrencies(true);

  const accountId = useAccountId();
  const { selectedAccount, accounts } = useSubstrateSecureState();

  // TODO: Workaround until we update account handling. This is the same
  // way we filter accounts in the top bar.
  const wallet = selectedAccount && findWallet(selectedAccount.meta.source);
  const walletAccounts = accounts.filter(({ meta: { source } }) => source === wallet?.extensionName);

  const { data, getDestinationChains, originatingChains, getAvailableTokens } = useXCMBridge();

  const schema: BridgeValidationParams = {
    [BRIDGE_AMOUNT_FIELD]: {
      minAmount: currentToken
        ? newMonetaryAmount(currentToken.minTransferAmount, getCurrencyFromTicker(currentToken.value), true)
        : undefined,
      maxAmount: currentToken
        ? newMonetaryAmount(currentToken.balance, getCurrencyFromTicker(currentToken.value), true)
        : undefined
    }
  };

  const transaction = useTransaction(Transaction.XCM_TRANSFER, {
    onSuccess: () => {
      setTokenData(form.values[BRIDGE_TO_FIELD] as ChainName);
      form.setFieldValue(BRIDGE_AMOUNT_FIELD, '');
    }
  });

  const handleSubmit = async (formData: BridgeFormData) => {
    if (!data || !formData || !currentToken) return;

    const address = formData[BRIDGE_TO_ACCOUNT_FIELD] as string;

    const { signer } = await web3FromAddress(address);
    const adapter = data.bridge.findAdapter(formData[BRIDGE_FROM_FIELD] as ChainName);
    const apiPromise = data.provider.getApiPromise(formData[BRIDGE_FROM_FIELD] as string);

    apiPromise.setSigner(signer);
    adapter.setApi(apiPromise);

    const transferCurrency = getCurrencyFromTicker(currentToken.value);
    const transferAmount = newMonetaryAmount(form.values[BRIDGE_AMOUNT_FIELD] || 0, transferCurrency, true);

    const fromChain = originatingChains?.find((chain) => chain.id === formData[BRIDGE_FROM_FIELD]) as ChainData;
    const toChain = destinationChains.find((chain) => chain.id === formData[BRIDGE_TO_FIELD]) as ChainData;

    transaction.execute(adapter, fromChain, toChain, address, transferAmount);
  };

  const form = useForm<BridgeFormData>({
    initialValues: {
      [BRIDGE_AMOUNT_FIELD]: '',
      [BRIDGE_TOKEN_FIELD]: '',
      [BRIDGE_TO_ACCOUNT_FIELD]: accountId?.toString() || ''
    },
    onSubmit: handleSubmit,
    validationSchema: bridgeSchema(schema, t)
  });

  const handleOriginatingChainChange = (chain: ChainName) => {
    const destinationChains = getDestinationChains(chain);

    setDestinationChains(destinationChains);
    form.setFieldValue(BRIDGE_TO_FIELD, destinationChains[0].id);
  };

  const handleDestinationChainChange = async (chain: ChainName) => {
    setTokenData(chain);
  };

  const handleTickerChange = (ticker: string, name: string) => {
    form.setFieldValue(name, ticker);
    setCurrentToken(transferableTokens.find((token) => token.value === ticker));
  };

  const handleDestinationAccountChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    form.setFieldValue(BRIDGE_TO_ACCOUNT_FIELD, e.target.value);
  };

  const setTokenData = useCallback(
    async (destination: ChainName) => {
      if (!form) return;

      const tokens = await getAvailableTokens(
        form.values[BRIDGE_FROM_FIELD] as ChainName,
        destination,
        accountId ? accountId.toString() : '',
        form.values[BRIDGE_TO_ACCOUNT_FIELD] as string
      );

      if (!tokens) return;

      setTransferableTokens(tokens);

      // Update token data if selected token exists in new data
      const token = tokens.find((token) => token.value === currentToken?.value) || tokens[0];

      setCurrentToken(token);
      form.setFieldValue(BRIDGE_TOKEN_FIELD, token.value);
    },
    [accountId, currentToken, form, getAvailableTokens]
  );

  const transferMonetaryAmount = currentToken
    ? newSafeMonetaryAmount(form.values[BRIDGE_AMOUNT_FIELD] || 0, getCurrencyFromTicker(currentToken.value), true)
    : 0;

  const valueUSD = transferMonetaryAmount
    ? convertMonetaryAmountToValueInUSD(
        transferMonetaryAmount,
        getTokenPrice(prices, currentToken?.value as string)?.usd
      )
    : 0;

  const isCTADisabled = isFormDisabled(form);

  useEffect(() => {
    if (!originatingChains?.length) return;

    // This prevents a render loop caused by setFieldValue
    if (form.values[BRIDGE_FROM_FIELD]) return;

    const destinationChains = getDestinationChains(originatingChains[0].id);

    form.setFieldValue(BRIDGE_FROM_FIELD, originatingChains[0].id);
    form.setFieldValue(BRIDGE_TO_FIELD, destinationChains[0].id);

    setDestinationChains(destinationChains);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originatingChains]);

  useEffect(() => {
    if (!destinationChains?.length) return;

    setTokenData(destinationChains[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId, destinationChains]);

  useEffect(() => {
    form.setFieldValue(BRIDGE_TO_ACCOUNT_FIELD, accountId?.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  if (!originatingChains || !destinationChains || !transferableTokens.length) {
    return (
      <Flex justifyContent='center'>
        <LoadingSpinner variant='indeterminate' />
      </Flex>
    );
  }

  return (
    <form onSubmit={form.handleSubmit}>
      <Flex direction='column' gap='spacing4'>
        <ChainSelectSection justifyContent='space-between'>
          <StyledSourceChainSelect
            label='Source Chain'
            items={originatingChains}
            {...mergeProps(form.getSelectFieldProps(BRIDGE_FROM_FIELD, false), {
              onSelectionChange: (key: Key) => handleOriginatingChainChange(key as ChainName)
            })}
          />
          <StyledArrowRightCircle color='secondary' strokeWidth={2} />
          <ChainSelect
            label='Destination Chain'
            items={destinationChains}
            {...mergeProps(form.getSelectFieldProps(BRIDGE_TO_FIELD, false), {
              onSelectionChange: (key: Key) => handleDestinationChainChange(key as ChainName)
            })}
          />
        </ChainSelectSection>
        <div>
          <TokenInput
            placeholder='0.00'
            label='Transfer amount'
            balance={currentToken?.balance.toString() || 0}
            humanBalance={currentToken?.balance.toString() || 0}
            valueUSD={valueUSD || 0}
            selectProps={mergeProps(form.getSelectFieldProps(BRIDGE_TOKEN_FIELD), {
              onSelectionChange: (ticker: Key) => handleTickerChange(ticker as string, BRIDGE_TOKEN_FIELD),
              items: transferableTokens
            })}
            {...mergeProps(form.getFieldProps(BRIDGE_AMOUNT_FIELD, false, true))}
          />
        </div>
        <AccountSelect
          label='Destination'
          items={walletAccounts}
          {...mergeProps(form.getSelectFieldProps(BRIDGE_TO_ACCOUNT_FIELD, false), {
            onChange: handleDestinationAccountChange
          })}
        />
        <TransactionDetails>
          <TransactionDetailsGroup>
            <TransactionDetailsDt size='xs' color='primary'>
              Origin chain transfer fee
            </TransactionDetailsDt>
            <TransactionDetailsDd size='xs'>{currentToken?.originFee}</TransactionDetailsDd>
          </TransactionDetailsGroup>
          <TransactionDetailsGroup>
            <TransactionDetailsDt>Destination chain transfer fee estimate</TransactionDetailsDt>
            <TransactionDetailsDd size='xs'>{`${currentToken?.destFee?.toString()} ${
              currentToken?.value
            }`}</TransactionDetailsDd>
          </TransactionDetailsGroup>
        </TransactionDetails>
        <AuthCTA size='large' type='submit' disabled={isCTADisabled} loading={transaction.isLoading}>
          {isCTADisabled ? 'Enter transfer amount' : t('transfer')}
        </AuthCTA>
      </Flex>
    </form>
  );
};

export { BridgeForm };
