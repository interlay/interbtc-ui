import { ChainName } from '@interlay/bridge';
import { newMonetaryAmount } from '@interlay/interbtc-api';
import { mergeProps } from '@react-aria/utils';
import { ChangeEventHandler, Key, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { convertMonetaryAmountToValueInUSD, newSafeMonetaryAmount } from '@/common/utils/utils';
import { Dd, DlGroup, Dt, Flex, TokenInput } from '@/component-library';
// import { TokenData } from '@/component-library/TokenInput/TokenList';
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
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const { getCurrencyFromTicker } = useGetCurrencies(bridgeLoaded);

  console.log('currentToken', currentToken);

  const accountId = useAccountId();
  const { accounts } = useSubstrateSecureState();

  const { getDestinationChains, originatingChains, getAvailableTokens } = useXCMBridge();

  // const setTokens = async () => {
  //   if (!accountId) return;

  //   console.log(
  //     'form.values',
  //     form.values[CROSS_CHAIN_TRANSFER_FROM_FIELD],
  //     form.values[CROSS_CHAIN_TRANSFER_TO_FIELD]
  //   );

  // };

  const handleSubmit = (data: CrossChainTransferFormData) => {
    console.log('submit data', data);
  };

  const handleOriginatingChainChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const destinationChains = getDestinationChains(e.target.value as ChainName);

    form.setFieldValue(CROSS_CHAIN_TRANSFER_FROM_FIELD, e.target.value);

    setDestinationChains(destinationChains);
  };

  const handleDestinationChainChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    form.setFieldValue(CROSS_CHAIN_TRANSFER_TO_FIELD, e.target.value);

    if (!accountId) return;

    setTransferableTokens([]);

    const tokens = await getAvailableTokens(
      form.values[CROSS_CHAIN_TRANSFER_FROM_FIELD] as ChainName,
      e.target.value as ChainName,
      accountId.toString(),
      form.values[CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD] as string
    );

    setTransferableTokens(tokens);
    setCurrentToken(tokens[0]);
  };

  const handleTickerChange = (ticker: string | undefined) => {
    console.log('ticker', ticker);
    // const selectedToken = transferableTokens.find((token: any) => token.ticker === ticker);
    // form.setFieldValue(CROSS_CHAIN_TRANSFER_TOKEN_FIELD, ticker);

    // setCurrentToken(selectedToken);
  };

  const handleDestinationAccountChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    form.setFieldValue(CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD, e.target.value);
  };

  const schema: CrossChainTransferValidationParams = {
    [CROSS_CHAIN_TRANSFER_AMOUNT_FIELD]: {
      minAmount: currentToken
        ? newMonetaryAmount(0, getCurrencyFromTicker(currentToken.ticker as string))
        : newMonetaryAmount(0, getCurrencyFromTicker('KSM')),
      maxAmount: currentToken
        ? newMonetaryAmount(currentToken.balance, getCurrencyFromTicker(currentToken.ticker as string))
        : newMonetaryAmount(0, getCurrencyFromTicker('KSM'))
    }
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

  const transferMonetaryAmount = currentToken
    ? newSafeMonetaryAmount(
        form.values[CROSS_CHAIN_TRANSFER_AMOUNT_FIELD] || 0,
        getCurrencyFromTicker(currentToken?.ticker as string),
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

  return (
    <form onSubmit={form.handleSubmit}>
      <Flex direction='column' gap='spacing4'>
        <ChainSelectSection justifyContent='space-between'>
          <StyledSourceChainSelect
            label='Source Chain'
            chains={originatingChains || []}
            {...mergeProps(form.getFieldProps(CROSS_CHAIN_TRANSFER_FROM_FIELD), {
              onChange: handleOriginatingChainChange
            })}
          />
          <StyledArrowRightCircle color='secondary' strokeWidth={2} />
          <ChainSelect
            label='Destination Chain'
            chains={destinationChains}
            {...mergeProps(form.getFieldProps(CROSS_CHAIN_TRANSFER_TO_FIELD), {
              onChange: handleDestinationChainChange
            })}
          />
        </ChainSelectSection>
        <div>
          <TokenInput
            placeholder='0.00'
            label='Transfer amount'
            balance={currentToken?.balance?.toString() || 0}
            humanBalance={currentToken?.balance.toString() || 0}
            valueUSD={valueUSD || 0}
            selectProps={mergeProps(form.getFieldProps(CROSS_CHAIN_TRANSFER_TOKEN_FIELD, false), {
              onSelectionChange: (ticker: Key) => handleTickerChange(ticker as string),
              items: transferableTokens || []
            })}
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
            <Dd size='xs'>0 DOT</Dd>
          </DlGroup>
          <DlGroup justifyContent='space-between'>
            <Dt size='xs' color='primary'>
              Destination chain transfer fee
            </Dt>
            <Dd size='xs'>0 INTR</Dd>
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
