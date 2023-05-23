import { GovernanceCurrency, newMonetaryAmount, WrappedCurrency } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { mergeProps } from '@react-aria/utils';
import { useTranslation } from 'react-i18next';

import {
  convertMonetaryAmountToValueInUSD,
  displayMonetaryAmountInUSDFormat,
  newSafeMonetaryAmount
} from '@/common/utils/utils';
import { Dd, DlGroup, Dt, Tabs, TabsItem, TokenInput } from '@/component-library';
import { AuthCTA } from '@/components';
import { TRANSACTION_FEE_AMOUNT, WRAPPED_TOKEN, WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import { useForm } from '@/lib/form';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { useTransaction } from '@/utils/hooks/transaction';

import { StyledDl, StyledEarnStrategyForm, StyledEarnStrategyFormContent } from './EarnStrategyFrom.style';

interface EarnStrategyFormProps {
  riskVariant: RiskVariant;
}

interface EarnStrategyFormBaseProps extends EarnStrategyFormProps {
  hasActiveStrategy: boolean | undefined;
}

type EarnStrategyDepositFormProps = EarnStrategyFormBaseProps;

interface EarnStrategyWithdrawalFormProps extends EarnStrategyFormBaseProps {
  maxWithdrawableAmount: MonetaryAmount<WrappedCurrency> | undefined;
}

type EarnStrategyFormType = 'deposit' | 'withdraw';
type RiskVariant = 'low' | 'high';

type TabData = { type: EarnStrategyFormType; title: string };

const tabs: Array<TabData> = [
  {
    type: 'deposit',
    title: 'Deposit'
  },
  {
    type: 'withdraw',
    title: 'Withdraw'
  }
];

interface EarnStrategyDepositFormData {
  deposit?: string;
}

interface EarnStrategyWithdrawalFormData {
  withdraw?: string;
  withdrawAsWrapped?: boolean;
}

// TODO: move to separate file
const EarnStrategyWithdrawalForm = ({
  riskVariant,
  maxWithdrawableAmount
}: EarnStrategyWithdrawalFormProps): JSX.Element => {
  const prices = useGetPrices();

  const handleSubmit = (data: EarnStrategyWithdrawalFormData) => {
    // TODO
    console.log(data, riskVariant);
  };

  const form = useForm<EarnStrategyWithdrawalFormData>({
    initialValues: { withdraw: '', withdrawAsWrapped: false },
    // TODO: validationSchema
    onSubmit: handleSubmit
  });

  const inputMonetaryAmount = newSafeMonetaryAmount(form.values['withdraw'] || 0, WRAPPED_TOKEN, true);
  const inputUSDValue = convertMonetaryAmountToValueInUSD(inputMonetaryAmount, prices?.[WRAPPED_TOKEN_SYMBOL].usd);

  return (
    <form onSubmit={form.handleSubmit}>
      <StyledEarnStrategyFormContent>
        <TokenInput
          placeholder='0.00'
          ticker={WRAPPED_TOKEN_SYMBOL}
          // TODO: aria-label
          balance={maxWithdrawableAmount?.toString()}
          humanBalance={maxWithdrawableAmount?.toString()}
          balanceLabel='Available' // TODO: add as transalation
          valueUSD={inputUSDValue ?? undefined}
          {...mergeProps(form.getFieldProps('withdraw'))}
        />
        <EarnStrategyFormFees amount={TRANSACTION_FEE_AMOUNT} />
      </StyledEarnStrategyFormContent>
    </form>
  );
};

interface EarnStrategyFormFeesProps {
  amount: MonetaryAmount<GovernanceCurrency>;
}

const EarnStrategyFormFees = ({ amount }: EarnStrategyFormFeesProps): JSX.Element => {
  const prices = useGetPrices();
  const { t } = useTranslation();

  return (
    <StyledDl direction='column' gap='spacing2'>
      <DlGroup justifyContent='space-between'>
        <Dt size='xs' color='primary'>
          {t('fees')}
        </Dt>
        <Dd size='xs'>
          {amount.toHuman()} {amount.currency.ticker} (
          {displayMonetaryAmountInUSDFormat(amount, getTokenPrice(prices, amount.currency.ticker)?.usd)})
        </Dd>
      </DlGroup>
    </StyledDl>
  );
};

// TODO: move to separate file
const EarnStrategyDepositForm = ({ riskVariant, hasActiveStrategy }: EarnStrategyDepositFormProps): JSX.Element => {
  const { getAvailableBalance } = useGetBalances();
  const prices = useGetPrices();

  // TODO: add transaction
  const transaction = useTransaction();

  const handleSubmit = (data: EarnStrategyDepositFormData) => {
    // TODO
    console.log(data, riskVariant);
  };

  const form = useForm<EarnStrategyDepositFormData>({
    initialValues: { deposit: '' },
    // TODO: validationSchema
    onSubmit: handleSubmit
  });

  const maxDepositAmount = getAvailableBalance(WRAPPED_TOKEN_SYMBOL);

  const inputMonetaryAmount = newSafeMonetaryAmount(form.values['deposit'] || 0, WRAPPED_TOKEN, true);
  const inputUSDValue = convertMonetaryAmountToValueInUSD(inputMonetaryAmount, prices?.[WRAPPED_TOKEN_SYMBOL].usd);

  const isSubmitButtonDisabled = false; // TODO: add validation
  return (
    <form onSubmit={form.handleSubmit}>
      <StyledEarnStrategyFormContent>
        <TokenInput
          placeholder='0.00'
          ticker={WRAPPED_TOKEN_SYMBOL}
          // TODO: aria-label
          balance={maxDepositAmount?.toString()}
          humanBalance={maxDepositAmount?.toString()}
          valueUSD={inputUSDValue ?? undefined}
          {...mergeProps(form.getFieldProps('deposit'))}
        />

        {hasActiveStrategy}
        <EarnStrategyFormFees amount={TRANSACTION_FEE_AMOUNT} />
        <AuthCTA type='submit' size='large' disabled={isSubmitButtonDisabled} loading={transaction.isLoading}>
          {hasActiveStrategy ? 'Update position' : 'Deposit'}
        </AuthCTA>
      </StyledEarnStrategyFormContent>
    </form>
  );
};

const EarnStrategyForm = ({ riskVariant }: EarnStrategyFormProps): JSX.Element => {
  // TODO: replace with actually withdrawable amount once we know how to get that information
  const maxWithdrawableAmount = newMonetaryAmount(1.317, WRAPPED_TOKEN, true);
  const hasActiveStrategy = maxWithdrawableAmount && !maxWithdrawableAmount.isZero();

  return (
    <StyledEarnStrategyForm>
      <Tabs fullWidth size='large'>
        {tabs.map(({ type, title }) => (
          <TabsItem key={type} title={title}>
            {type === 'deposit' ? (
              <EarnStrategyDepositForm key={type} riskVariant={riskVariant} hasActiveStrategy={hasActiveStrategy} />
            ) : (
              <EarnStrategyWithdrawalForm
                key={type}
                riskVariant={riskVariant}
                hasActiveStrategy={hasActiveStrategy}
                maxWithdrawableAmount={maxWithdrawableAmount}
              />
            )}
          </TabsItem>
        ))}
      </Tabs>
    </StyledEarnStrategyForm>
  );
};

export { EarnStrategyForm };
