import { newMonetaryAmount } from '@interlay/interbtc-api';
import { mergeProps } from '@react-aria/utils';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, newSafeMonetaryAmount } from '@/common/utils/utils';
import { TokenInput } from '@/component-library';
import { AuthCTA } from '@/components';
import { TRANSACTION_FEE_AMOUNT, WRAPPED_TOKEN, WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import { isFormDisabled, StrategySchema, useForm } from '@/lib/form';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { useTransaction } from '@/utils/hooks/transaction';

import { StrategyDepositFormData } from '../../../types/form';
import { StrategyFormBaseProps } from '../StrategyForm';
import { StyledStrategyFormContent } from '../StrategyForm.style';
import { StrategyFormFees } from '../StrategyFormFees';

const StrategyDepositForm = ({ riskVariant, hasActiveStrategy }: StrategyFormBaseProps): JSX.Element => {
  const { getAvailableBalance } = useGetBalances();
  const prices = useGetPrices();
  const { t } = useTranslation();
  // TODO: add transaction
  const transaction = useTransaction();

  const handleSubmit = (data: StrategyDepositFormData) => {
    // TODO: Execute transaction with params
    // transaction.execute();
    console.log(`transaction should be executed with parameters: ${data}, ${riskVariant}`);
  };

  const minAmount = newMonetaryAmount(1, WRAPPED_TOKEN);
  const maxDepositAmount = getAvailableBalance(WRAPPED_TOKEN_SYMBOL) || newMonetaryAmount(0, WRAPPED_TOKEN);

  const form = useForm<StrategyDepositFormData>({
    initialValues: { deposit: '' },
    validationSchema: StrategySchema('deposit', { maxAmount: maxDepositAmount, minAmount }),
    onSubmit: handleSubmit
  });

  const inputMonetaryAmount = newSafeMonetaryAmount(form.values['deposit'] || 0, WRAPPED_TOKEN, true);
  const inputUSDValue = convertMonetaryAmountToValueInUSD(inputMonetaryAmount, prices?.[WRAPPED_TOKEN_SYMBOL].usd);
  const isSubmitButtonDisabled = isFormDisabled(form);

  return (
    <form onSubmit={form.handleSubmit}>
      <StyledStrategyFormContent>
        <TokenInput
          placeholder='0.00'
          ticker={WRAPPED_TOKEN_SYMBOL}
          aria-label={t('forms.field_amount', { field: t('deposit') })}
          balance={maxDepositAmount?.toString()}
          humanBalance={maxDepositAmount?.toString()}
          valueUSD={inputUSDValue ?? undefined}
          {...mergeProps(form.getFieldProps('deposit'))}
        />
        <StrategyFormFees amount={TRANSACTION_FEE_AMOUNT} />
        <AuthCTA type='submit' size='large' disabled={isSubmitButtonDisabled} loading={transaction.isLoading}>
          {hasActiveStrategy ? t('strategy.update_position') : t('deposit')}
        </AuthCTA>
      </StyledStrategyFormContent>
    </form>
  );
};

export { StrategyDepositForm };
