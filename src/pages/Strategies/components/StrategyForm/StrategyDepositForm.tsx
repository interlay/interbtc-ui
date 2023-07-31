import { MonetaryAmount } from '@interlay/monetary-js';
import { mergeProps } from '@react-aria/utils';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, newSafeMonetaryAmount } from '@/common/utils/utils';
import { Flex, TokenInput } from '@/component-library';
import { AuthCTA, TransactionFeeDetails } from '@/components';
import { WRAPPED_TOKEN, WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import { useGetPrices } from '@/hooks/api/use-get-prices';
import { Transaction, useTransaction } from '@/hooks/transaction';
import {
  isFormDisabled,
  STRATEGY_DEPOSIT_AMOUNT_FIELD,
  STRATEGY_DEPOSIT_FEE_TOKEN_FIELD,
  StrategyDepositFormData,
  strategyDepositSchema,
  useForm
} from '@/lib/form';

import { StrategyData } from '../../hooks/use-get-strategies';
import { useGetStrategyLimitsAmount } from '../../hooks/use-get-strategy-limits-amount';
import { StrategyPositionData } from '../../hooks/use-get-strategy-position';
import { StrategyFormType } from '../../types';

type StrategyDepositFormProps = {
  strategy: StrategyData;
  position?: StrategyPositionData;
};

const StrategyDepositForm = ({ strategy, position }: StrategyDepositFormProps): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();
  const transaction = useTransaction(Transaction.LOANS_LEND, {
    onSuccess: () => {
      form.resetForm();
    }
  });
  const { maxAmount, minAmount } = useGetStrategyLimitsAmount(StrategyFormType.DEPOSIT, strategy, position);

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
    validationSchema: strategyDepositSchema('deposit', { maxAmount, minAmount }),
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
  const inputUSDValue = convertMonetaryAmountToValueInUSD(inputMonetaryAmount, prices?.[WRAPPED_TOKEN_SYMBOL].usd) || 0;
  const isSubmitButtonDisabled = isFormDisabled(form);

  return (
    <form onSubmit={form.handleSubmit}>
      <Flex marginTop='spacing4' direction='column' gap='spacing8' justifyContent='space-between'>
        <TokenInput
          placeholder='0.00'
          ticker={WRAPPED_TOKEN_SYMBOL}
          aria-label={t('forms.field_amount', { field: t('deposit') })}
          balance={maxAmount.toString()}
          humanBalance={maxAmount.toString()}
          valueUSD={inputUSDValue}
          {...mergeProps(form.getFieldProps(STRATEGY_DEPOSIT_AMOUNT_FIELD))}
        />
        <Flex direction='column' gap='spacing4'>
          <TransactionFeeDetails
            fee={transaction.fee}
            selectProps={{ ...form.getSelectFieldProps(STRATEGY_DEPOSIT_FEE_TOKEN_FIELD) }}
          />
          <AuthCTA type='submit' size='large' disabled={isSubmitButtonDisabled} loading={transaction.isLoading}>
            {t('deposit')}
          </AuthCTA>
        </Flex>
      </Flex>
    </form>
  );
};

export { StrategyDepositForm };
