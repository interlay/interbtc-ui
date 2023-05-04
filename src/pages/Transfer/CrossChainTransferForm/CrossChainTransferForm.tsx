import { ChainName } from '@interlay/bridge';
import { newMonetaryAmount } from '@interlay/interbtc-api';
import { mergeProps } from '@react-aria/utils';
import { ChangeEventHandler, Key, useEffect, useState } from 'react';
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
import { useXCMBridge } from '@/utils/hooks/api/xcm/use-xcm-bridge';
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
  const [transferableTokens, setTransferableTokens] = useState<any[]>([]);
  const [currentToken, setCurrentToken] = useState<any | undefined>();

  const prices = useGetPrices();
  const { t } = useTranslation();
  const { getCurrencyFromTicker } = useGetCurrencies(true);

  const accountId = useAccountId();
  const { accounts } = useSubstrateSecureState();

  const { getDestinationChains, originatingChains, getAvailableTokens } = useXCMBridge();

  const schema: CrossChainTransferValidationParams = {
    [CROSS_CHAIN_TRANSFER_AMOUNT_FIELD]: {
      // TODO: Make min and max amount undefined and remove fallback
      minAmount: currentToken
        ? newMonetaryAmount(currentToken.minTransferAmount, getCurrencyFromTicker(currentToken.value), true)
        : undefined,
      maxAmount: currentToken
        ? newMonetaryAmount(currentToken.balance, getCurrencyFromTicker(currentToken.value), true)
        : undefined
    }
  };

  const handleSubmit = (data: CrossChainTransferFormData) => {
    console.log('submit data', data);
  };

  const form = useForm<CrossChainTransferFormData>({
    initialValues: {
      [CROSS_CHAIN_TRANSFER_AMOUNT_FIELD]: '',
      [CROSS_CHAIN_TRANSFER_FROM_FIELD]: '',
      [CROSS_CHAIN_TRANSFER_TO_FIELD]: '',
      [CROSS_CHAIN_TRANSFER_TOKEN_FIELD]: '',
      [CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD]: accountId?.toString() || ''
    },
    onSubmit: handleSubmit,
    validationSchema: crossChainTransferSchema(schema, t)
  });

  const handleOriginatingChainChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const destinationChains = getDestinationChains(e.target.value as ChainName);
    setDestinationChains(destinationChains);

    form.setFieldValue(CROSS_CHAIN_TRANSFER_TO_FIELD, destinationChains[0].id);
  };

  const handleDestinationChainChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (!accountId) return;

    form.setFieldValue(CROSS_CHAIN_TRANSFER_TO_FIELD, e.target.value, true);

    const tokens = await getAvailableTokens(
      form.values[CROSS_CHAIN_TRANSFER_FROM_FIELD] as ChainName,
      e.target.value as ChainName,
      accountId.toString(),
      form.values[CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD] as string
    );

    setTransferableTokens(tokens);
    setCurrentToken(tokens[0]);
  };

  useEffect(() => {
    if (!transferableTokens.length) return;
    const defaultToken = transferableTokens[0];

    form.setFieldValue(CROSS_CHAIN_TRANSFER_TOKEN_FIELD, defaultToken.value, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transferableTokens]);

  const handleTickerChange = (ticker: string, name: string) => {
    form.setFieldValue(name, ticker, true);
    setCurrentToken(transferableTokens.find((token) => token.value === ticker));
  };

  const handleDestinationAccountChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    form.setFieldValue(CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD, e.target.value);
  };

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
        getTokenPrice(prices, currentToken?.ticker as string)?.usd
      )
    : 0;

  const isCTADisabled = isFormDisabled(form);

  useEffect(() => {
    if (!originatingChains?.length) return;

    // This prevents a render loop caused by setFieldValue
    if (form.values[CROSS_CHAIN_TRANSFER_FROM_FIELD]) return;

    const destinationChains = getDestinationChains(originatingChains[0].id as ChainName);

    form.setFieldValue(CROSS_CHAIN_TRANSFER_FROM_FIELD, originatingChains[0].id);
    form.setFieldValue(CROSS_CHAIN_TRANSFER_TO_FIELD, destinationChains[0].id);

    setDestinationChains(destinationChains);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originatingChains]);

  useEffect(() => {
    if (!destinationChains?.length) return;
    if (!accountId) return;

    const getTokensForNewChain = async () => {
      const tokens = await getAvailableTokens(
        form.values[CROSS_CHAIN_TRANSFER_FROM_FIELD] as ChainName,
        destinationChains[0].id as ChainName,
        accountId.toString(),
        form.values[CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD] as string
      );

      setTransferableTokens(tokens);
      setCurrentToken(tokens[0]);
    };

    getTokensForNewChain();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId, destinationChains]);

  if (!originatingChains || !destinationChains || !transferableTokens) {
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
            chains={originatingChains || []}
            {...mergeProps(form.getFieldProps(CROSS_CHAIN_TRANSFER_FROM_FIELD, false), {
              onChange: handleOriginatingChainChange
            })}
          />
          <StyledArrowRightCircle color='secondary' strokeWidth={2} />
          <ChainSelect
            label='Destination Chain'
            chains={destinationChains}
            {...mergeProps(form.getFieldProps(CROSS_CHAIN_TRANSFER_TO_FIELD, false), {
              onChange: handleDestinationChainChange
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
            selectProps={mergeProps(form.getFieldProps(CROSS_CHAIN_TRANSFER_TOKEN_FIELD, false), {
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
            <Dd size='xs'>{currentToken?.destFee}</Dd>
          </DlGroup>
        </StyledDl>
        <AuthCTA size='large' type='submit' disabled={isCTADisabled}>
          {t('transfer')}
        </AuthCTA>
      </Flex>
    </form>
  );
};

export default CrossChainTransferForm;
