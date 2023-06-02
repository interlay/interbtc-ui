import { ChainName } from '@interlay/bridge';
import { newMonetaryAmount } from '@interlay/interbtc-api';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { mergeProps } from '@react-aria/utils';
import { ChangeEventHandler, Key, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, newSafeMonetaryAmount } from '@/common/utils/utils';
import { Dd, DlGroup, Dt, Flex, LoadingSpinner, TokenInput } from '@/component-library';
import { AccountSelect, AuthCTA } from '@/components';
import {
  CROSS_CHAIN_TRANSFER_AMOUNT_FIELD,
  CROSS_CHAIN_TRANSFER_FROM_FIELD,
  CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD,
  CROSS_CHAIN_TRANSFER_TO_FIELD,
  CROSS_CHAIN_TRANSFER_TOKEN_FIELD,
  CrossChainTransferFormData,
  crossChainTransferSchema,
  CrossChainTransferValidationParams,
  isFormDisabled,
  useForm
} from '@/lib/form';
import { useSubstrateSecureState } from '@/lib/substrate';
import { Chains } from '@/types/chains';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetCurrencies } from '@/utils/hooks/api/use-get-currencies';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { useXCMBridge, XCMTokenData } from '@/utils/hooks/api/xcm/use-xcm-bridge';
import { Transaction, useTransaction } from '@/utils/hooks/transaction';
import useAccountId from '@/utils/hooks/use-account-id';

import { ChainSelect } from './components';
import {
  ChainSelectSection,
  StyledArrowRightCircle,
  StyledDl,
  StyledSourceChainSelect
} from './CrossChainTransferForm.styles';

const CrossChainTransferForm = (): JSX.Element => {
  const [destinationChains, setDestinationChains] = useState<Chains>([]);
  const [transferableTokens, setTransferableTokens] = useState<XCMTokenData[]>([]);
  const [currentToken, setCurrentToken] = useState<XCMTokenData>();

  const prices = useGetPrices();
  const { t } = useTranslation();
  const { getCurrencyFromTicker } = useGetCurrencies(true);

  const accountId = useAccountId();
  const { accounts } = useSubstrateSecureState();

  const { data, getDestinationChains, originatingChains, getAvailableTokens } = useXCMBridge();

  const schema: CrossChainTransferValidationParams = {
    [CROSS_CHAIN_TRANSFER_AMOUNT_FIELD]: {
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
      setTokenData(form.values[CROSS_CHAIN_TRANSFER_TO_FIELD] as ChainName);
      form.setFieldValue(CROSS_CHAIN_TRANSFER_AMOUNT_FIELD, '');
    }
  });

  const handleSubmit = async (formData: CrossChainTransferFormData) => {
    if (!data || !formData || !currentToken) return;

    const address = formData[CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD] as string;

    const { signer } = await web3FromAddress(address);
    const adapter = data.bridge.findAdapter(formData[CROSS_CHAIN_TRANSFER_FROM_FIELD] as ChainName);
    const apiPromise = data.provider.getApiPromise(formData[CROSS_CHAIN_TRANSFER_FROM_FIELD] as string);

    apiPromise.setSigner(signer);
    adapter.setApi(apiPromise);

    const transferCurrency = getCurrencyFromTicker(currentToken.value);
    const transferAmount = newMonetaryAmount(
      form.values[CROSS_CHAIN_TRANSFER_AMOUNT_FIELD] || 0,
      transferCurrency,
      true
    );

    const fromChain = formData[CROSS_CHAIN_TRANSFER_FROM_FIELD] as ChainName;
    const toChain = formData[CROSS_CHAIN_TRANSFER_TO_FIELD] as ChainName;

    transaction.execute(adapter, fromChain, toChain, address, transferAmount);
  };

  const form = useForm<CrossChainTransferFormData>({
    initialValues: {
      [CROSS_CHAIN_TRANSFER_AMOUNT_FIELD]: '',
      [CROSS_CHAIN_TRANSFER_TOKEN_FIELD]: '',
      [CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD]: accountId?.toString() || ''
    },
    onSubmit: handleSubmit,
    validationSchema: crossChainTransferSchema(schema, t)
  });

  const handleOriginatingChainChange = (chain: ChainName, name: string) => {
    form.setFieldValue(name, chain);

    const destinationChains = getDestinationChains(chain);

    setDestinationChains(destinationChains);
    form.setFieldValue(CROSS_CHAIN_TRANSFER_TO_FIELD, destinationChains[0].id);
  };

  const handleDestinationChainChange = async (chain: ChainName, name: string) => {
    if (!accountId) return;

    form.setFieldValue(name, chain);

    setTokenData(chain);
  };

  const handleTickerChange = (ticker: string, name: string) => {
    form.setFieldValue(name, ticker);
    setCurrentToken(transferableTokens.find((token) => token.value === ticker));
  };

  const handleDestinationAccountChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    form.setFieldValue(CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD, e.target.value);
  };

  const setTokenData = useCallback(
    async (destination: ChainName) => {
      if (!accountId || !form) return;

      const tokens = await getAvailableTokens(
        form.values[CROSS_CHAIN_TRANSFER_FROM_FIELD] as ChainName,
        destination,
        accountId.toString(),
        form.values[CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD] as string
      );

      if (!tokens) return;

      setTransferableTokens(tokens);

      // Update token data if selected token exists in new data
      const token = tokens.find((token) => token.value === currentToken?.value) || tokens[0];

      setCurrentToken(token);
      form.setFieldValue(CROSS_CHAIN_TRANSFER_TOKEN_FIELD, token.value);
    },
    [accountId, currentToken, form, getAvailableTokens]
  );

  const transferMonetaryAmount = currentToken
    ? newSafeMonetaryAmount(
        form.values[CROSS_CHAIN_TRANSFER_AMOUNT_FIELD] || 0,
        getCurrencyFromTicker(currentToken.value),
        true
      )
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
    if (form.values[CROSS_CHAIN_TRANSFER_FROM_FIELD]) return;

    const destinationChains = getDestinationChains(originatingChains[0].id);

    form.setFieldValue(CROSS_CHAIN_TRANSFER_FROM_FIELD, originatingChains[0].id);
    form.setFieldValue(CROSS_CHAIN_TRANSFER_TO_FIELD, destinationChains[0].id);

    setDestinationChains(destinationChains);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originatingChains]);

  useEffect(() => {
    if (!destinationChains?.length) return;
    if (!accountId) return;

    setTokenData(destinationChains[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId, destinationChains]);

  // TODO: When we refactor account select this should be handled there so
  // that it's consitent across the application
  useEffect(() => {
    if (!accountId) return;
    form.setFieldValue(CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD, accountId?.toString());
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
            onSelectionChange={(chain: Key) =>
              handleOriginatingChainChange(chain as ChainName, CROSS_CHAIN_TRANSFER_FROM_FIELD)
            }
            {...mergeProps(form.getFieldProps(CROSS_CHAIN_TRANSFER_FROM_FIELD, false))}
          />
          <StyledArrowRightCircle color='secondary' strokeWidth={2} />
          <ChainSelect
            label='Destination Chain'
            items={destinationChains}
            onSelectionChange={(chain: Key) =>
              handleDestinationChainChange(chain as ChainName, CROSS_CHAIN_TRANSFER_TO_FIELD)
            }
            {...mergeProps(form.getFieldProps(CROSS_CHAIN_TRANSFER_TO_FIELD, false))}
          />
        </ChainSelectSection>
        <div>
          <TokenInput
            placeholder='0.00'
            label='Transfer amount'
            balance={currentToken?.balance.toString() || 0}
            humanBalance={currentToken?.balance.toString() || 0}
            valueUSD={valueUSD || 0}
            selectProps={mergeProps(form.getFieldProps(CROSS_CHAIN_TRANSFER_TOKEN_FIELD), {
              onSelectionChange: (ticker: Key) =>
                handleTickerChange(ticker as string, CROSS_CHAIN_TRANSFER_TOKEN_FIELD),
              items: transferableTokens
            })}
            {...mergeProps(form.getFieldProps(CROSS_CHAIN_TRANSFER_AMOUNT_FIELD))}
          />
        </div>
        <AccountSelect
          label='Destination'
          accounts={accounts}
          {...mergeProps(form.getFieldProps(CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD, false), {
            onChange: handleDestinationAccountChange
          })}
        />
        <StyledDl direction='column' gap='spacing2'>
          <DlGroup justifyContent='space-between'>
            <Dt size='xs' color='primary'>
              Origin chain transfer fee
            </Dt>
            <Dd size='xs'>{currentToken?.originFee}</Dd>
          </DlGroup>
          <DlGroup justifyContent='space-between'>
            <Dt size='xs' color='primary'>
              Destination chain transfer fee estimate
            </Dt>
            <Dd size='xs'>{`${currentToken?.destFee.toString()} ${currentToken?.value}`}</Dd>
          </DlGroup>
        </StyledDl>
        <AuthCTA size='large' type='submit' disabled={isCTADisabled} loading={transaction.isLoading}>
          {isCTADisabled ? 'Enter transfer amount' : t('transfer')}
        </AuthCTA>
      </Flex>
    </form>
  );
};

export default CrossChainTransferForm;
