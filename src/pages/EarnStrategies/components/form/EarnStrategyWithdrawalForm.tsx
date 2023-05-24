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
import { earnStrategySchema, isFormDisabled, useForm } from '@/lib/form';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { useTransaction } from '@/utils/hooks/transaction';

import { EarnStrategyWithdrawalFormData } from '../../types/form';
import { EarnStrategyFormBaseProps } from './EarnStrategyForm';
import { StyledEarnStrategyFormContent, StyledSwitchLabel } from './EarnStrategyForm.style';
import { EarnStrategyFormFees } from './EarnStrategyFormFees';

interface EarnStrategyWithdrawalFormProps extends EarnStrategyFormBaseProps {
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
  // or better move this computation to earn-strategy hook
  const mockedReceivableAssets = [
    amountToWithdraw.div(1.2),
    newMonetaryAmount(amountToWithdraw.toBig().mul(213.2), RELAY_CHAIN_NATIVE_TOKEN, true)
  ];

  return mockedReceivableAssets;
};

const EarnStrategyWithdrawalForm = ({
  riskVariant,
  hasActiveStrategy,
  maxWithdrawableAmount
}: EarnStrategyWithdrawalFormProps): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();
  // TODO: add transaction
  const transaction = useTransaction();

  const handleSubmit = (data: EarnStrategyWithdrawalFormData) => {
    // TODO: Execute transaction with params
    // transaction.execute()
    console.log(data, riskVariant);
  };

  const minAmount = newMonetaryAmount(1, WRAPPED_TOKEN);

  const form = useForm<EarnStrategyWithdrawalFormData>({
    initialValues: { withdraw: '', withdrawAsWrapped: true },
    validationSchema: earnStrategySchema('withdraw', {
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
      <StyledEarnStrategyFormContent>
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
          {t('earn_strategy.withdraw_rewards_in_wrapped', { wrappedCurrencySymbol: WRAPPED_TOKEN_SYMBOL })}{' '}
          <Switch defaultSelected {...mergeProps(form.getFieldProps('withdrawAsWrapped'))} />
        </StyledSwitchLabel>
        <ReceivableAssets assetAmounts={receivableAssets} prices={prices} />
        <EarnStrategyFormFees amount={TRANSACTION_FEE_AMOUNT} />
        <AuthCTA type='submit' size='large' disabled={isSubmitButtonDisabled} loading={transaction.isLoading}>
          {hasActiveStrategy ? t('earn_strategy.update_position') : t('withdraw')}
        </AuthCTA>
      </StyledEarnStrategyFormContent>
    </form>
  );
};

export { EarnStrategyWithdrawalForm };
