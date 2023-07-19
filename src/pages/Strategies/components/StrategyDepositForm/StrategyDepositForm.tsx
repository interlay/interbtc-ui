import { MonetaryAmount } from '@interlay/monetary-js';
import { mergeProps } from '@react-aria/utils';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, newSafeMonetaryAmount } from '@/common/utils/utils';
import { TokenInput } from '@/component-library';
import { AuthCTA, TransactionFeeDetails } from '@/components';
import { WRAPPED_TOKEN, WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import { isFormDisabled, StrategySchema, useForm } from '@/lib/form';
import {
  STRATEGY_DEPOSIT_AMOUNT_FIELD,
  STRATEGY_DEPOSIT_FEE_TOKEN_FIELD,
  StrategyDepositFormData
} from '@/lib/form/schemas/strategies';
import { useStrategyFormData } from '@/pages/Strategies/hooks/use-strategy-form-data';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { Transaction, useTransaction } from '@/utils/hooks/transaction';

import { StrategyFormProps } from '../../types';
import { StyledStrategyFormContent } from '../StrategyForm/StrategyForm.style';

const StrategyDepositForm = ({ strategyType }: StrategyFormProps): JSX.Element => {
  const prices = useGetPrices();
  const { maxAmount, minAmount } = useStrategyFormData(strategyType, 'deposit');
  const { t } = useTranslation();
  const transaction = useTransaction(Transaction.LOANS_LEND);

  const handleSubmit = (values: StrategyDepositFormData) => {
    const amount = values[STRATEGY_DEPOSIT_AMOUNT_FIELD];

    if (!amount) {
      return;
    }

    const monetaryAmount = new MonetaryAmount(WRAPPED_TOKEN, amount);

    transaction.execute(WRAPPED_TOKEN, monetaryAmount);
  };

  const form = useForm<StrategyDepositFormData>({
    initialValues: {
      [STRATEGY_DEPOSIT_AMOUNT_FIELD]: '',
      [STRATEGY_DEPOSIT_FEE_TOKEN_FIELD]: transaction.fee.defaultCurrency.ticker
    },
    validationSchema: StrategySchema(STRATEGY_DEPOSIT_AMOUNT_FIELD, 'deposit', { maxAmount, minAmount }),
    onSubmit: handleSubmit,
    onComplete: (values: StrategyDepositFormData) => {
      const amount = values[STRATEGY_DEPOSIT_AMOUNT_FIELD];

      if (!amount) {
        return;
      }

      const monetaryAmount = new MonetaryAmount(WRAPPED_TOKEN, amount);

      transaction.fee.estimate(WRAPPED_TOKEN, monetaryAmount);
    }
  });

  const inputMonetaryAmount = newSafeMonetaryAmount(
    form.values[STRATEGY_DEPOSIT_AMOUNT_FIELD] || 0,
    WRAPPED_TOKEN,
    true
  );
  const inputUSDValue = convertMonetaryAmountToValueInUSD(inputMonetaryAmount, prices?.[WRAPPED_TOKEN_SYMBOL].usd);
  const isSubmitButtonDisabled = isFormDisabled(form);

  return (
    <form onSubmit={form.handleSubmit}>
      <StyledStrategyFormContent>
        <TokenInput
          placeholder='0.00'
          ticker={WRAPPED_TOKEN_SYMBOL}
          aria-label={t('forms.field_amount', { field: t('deposit') })}
          balance={maxAmount.toString()}
          humanBalance={maxAmount.toString()}
          valueUSD={inputUSDValue ?? undefined}
          {...mergeProps(form.getFieldProps(STRATEGY_DEPOSIT_AMOUNT_FIELD))}
        />
        <TransactionFeeDetails
          fee={transaction.fee}
          selectProps={{ ...form.getSelectFieldProps(STRATEGY_DEPOSIT_FEE_TOKEN_FIELD) }}
        />
        <AuthCTA type='submit' size='large' disabled={isSubmitButtonDisabled} loading={transaction.isLoading}>
          {t('deposit')}
        </AuthCTA>
      </StyledStrategyFormContent>
    </form>
  );
};

export { StrategyDepositForm };
