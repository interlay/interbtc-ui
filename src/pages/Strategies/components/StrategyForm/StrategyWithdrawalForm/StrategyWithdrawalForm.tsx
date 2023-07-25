import { CurrencyExt, newMonetaryAmount, WrappedCurrency } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { mergeProps } from '@react-aria/utils';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, newSafeMonetaryAmount } from '@/common/utils/utils';
import { Switch, TokenInput } from '@/component-library';
import { AuthCTA, ReceivableAssets } from '@/components';
import {
  RELAY_CHAIN_NATIVE_TOKEN,
  TRANSACTION_FEE_AMOUNT,
  WRAPPED_TOKEN,
  WRAPPED_TOKEN_SYMBOL
} from '@/config/relay-chains';
import { useGetPrices } from '@/hooks/api/use-get-prices';
import { useTransaction } from '@/hooks/transaction';
import { isFormDisabled, StrategySchema, useForm } from '@/lib/form';

import { StrategyWithdrawalFormData } from '../../../types/form';
import { StrategyFormBaseProps } from '../StrategyForm';
import { StyledStrategyFormContent, StyledSwitchLabel } from '../StrategyForm.style';
import { StrategyFormFees } from '../StrategyFormFees';

interface StrategyWithdrawalFormProps extends StrategyFormBaseProps {
  maxWithdrawableAmount: MonetaryAmount<WrappedCurrency> | undefined;
}

const calculateReceivableAssets = (
  amountToWithdraw: MonetaryAmount<WrappedCurrency>,
  withdrawInWrapped: boolean
): Array<MonetaryAmount<CurrencyExt>> => {
  if (withdrawInWrapped) {
    return [amountToWithdraw];
  }
  // TODO: do some magic calculation to get the receivable assets based on input amount here,
  // or better move this computation to strategy hook
  const mockedReceivableAssets = [
    amountToWithdraw.div(1.2),
    newMonetaryAmount(amountToWithdraw.toBig().mul(213.2), RELAY_CHAIN_NATIVE_TOKEN, true)
  ];

  return mockedReceivableAssets;
};

const StrategyWithdrawalForm = ({
  riskVariant,
  hasActiveStrategy,
  maxWithdrawableAmount
}: StrategyWithdrawalFormProps): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();
  // TODO: add transaction
  const transaction = useTransaction();

  const handleSubmit = (data: StrategyWithdrawalFormData) => {
    // TODO: Execute transaction with params
    // transaction.execute()
    console.log(data, riskVariant);
  };

  const minAmount = newMonetaryAmount(1, WRAPPED_TOKEN);

  const form = useForm<StrategyWithdrawalFormData>({
    initialValues: { withdraw: '', withdrawAsWrapped: true },
    validationSchema: StrategySchema('withdraw', {
      maxAmount: maxWithdrawableAmount || newMonetaryAmount(0, WRAPPED_TOKEN),
      minAmount
    }),
    onSubmit: handleSubmit
  });

  const inputMonetaryAmount = newSafeMonetaryAmount(form.values['withdraw'] || 0, WRAPPED_TOKEN, true);
  const inputUSDValue = convertMonetaryAmountToValueInUSD(inputMonetaryAmount, prices?.[WRAPPED_TOKEN_SYMBOL].usd);
  const receivableAssets = calculateReceivableAssets(inputMonetaryAmount, !!form.values['withdrawAsWrapped']);
  const isSubmitButtonDisabled = isFormDisabled(form);

  return (
    <form onSubmit={form.handleSubmit}>
      <StyledStrategyFormContent>
        <TokenInput
          placeholder='0.00'
          ticker={WRAPPED_TOKEN_SYMBOL}
          aria-label={t('forms.field_amount', { field: t('withdraw') })}
          balance={maxWithdrawableAmount?.toString()}
          humanBalance={maxWithdrawableAmount?.toString()}
          balanceLabel={t('available')}
          valueUSD={inputUSDValue ?? undefined}
          {...mergeProps(form.getFieldProps('withdraw'))}
        />
        <StyledSwitchLabel>
          {t('strategy.withdraw_rewards_in_wrapped', { wrappedCurrencySymbol: WRAPPED_TOKEN_SYMBOL })}{' '}
          <Switch defaultSelected {...mergeProps(form.getFieldProps('withdrawAsWrapped'))} />
        </StyledSwitchLabel>
        <ReceivableAssets assetAmounts={receivableAssets} prices={prices} />
        <StrategyFormFees amount={TRANSACTION_FEE_AMOUNT} />
        <AuthCTA type='submit' size='large' disabled={isSubmitButtonDisabled} loading={transaction.isLoading}>
          {hasActiveStrategy ? t('strategy.update_position') : t('withdraw')}
        </AuthCTA>
      </StyledStrategyFormContent>
    </form>
  );
};

export { StrategyWithdrawalForm };
