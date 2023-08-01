import { newMonetaryAmount } from '@interlay/interbtc-api';
import { mergeProps } from '@react-aria/utils';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, newSafeMonetaryAmount } from '@/common/utils/utils';
import { Flex, TokenInput } from '@/component-library';
import { AuthCTA, TransactionFeeDetails } from '@/components';
import { WRAPPED_TOKEN, WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import { useGetPrices } from '@/hooks/api/use-get-prices';
import { Transaction, useTransaction } from '@/hooks/transaction';
import { isFormDisabled, useForm } from '@/lib/form';
import {
  STRATEGY_WITHDRAW_AMOUNT_FIELD,
  STRATEGY_WITHDRAW_FEE_TOKEN_FIELD,
  StrategyWithdrawFormData,
  strategyWithdrawSchema
} from '@/lib/form/schemas/strategies';

import { StrategyData } from '../../hooks/use-get-strategies';
import { useGetStrategyAvailableAmounts } from '../../hooks/use-get-strategy-available-amounts';
import { StrategyPositionData } from '../../hooks/use-get-strategy-position';
import { StrategyFormType } from '../../types';

type StrategyWithdrawalFormProps = {
  strategy: StrategyData;
  position?: StrategyPositionData;
};

const StrategyWithdrawalForm = ({ strategy, position }: StrategyWithdrawalFormProps): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();
  const transaction = useTransaction({
    onSuccess: () => {
      form.resetForm();
    }
  });
  const {
    data: { maxAmount, minAmount },
    isMaxAmount
  } = useGetStrategyAvailableAmounts(StrategyFormType.WITHDRAW, strategy, position);

  const getTransactionArgs = useCallback(
    (values: StrategyWithdrawFormData) => {
      const amount = values[STRATEGY_WITHDRAW_AMOUNT_FIELD] || 0;
      const monetaryAmount = newMonetaryAmount(amount, strategy.currency, true);

      return { monetaryAmount };
    },
    [strategy.currency]
  );

  const handleSubmit = (values: StrategyWithdrawFormData) => {
    const transactionData = getTransactionArgs(values);

    if (!transactionData) return;

    const { monetaryAmount } = transactionData;

    const isWithdrawAll = isMaxAmount(monetaryAmount);

    if (isWithdrawAll) {
      return transaction.execute(Transaction.STRATEGIES_ALL_WITHDRAW, monetaryAmount.currency);
    } else {
      return transaction.execute(Transaction.STRATEGIES_WITHDRAW, monetaryAmount.currency, monetaryAmount);
    }
  };

  const form = useForm<StrategyWithdrawFormData>({
    initialValues: {
      [STRATEGY_WITHDRAW_AMOUNT_FIELD]: '',
      [STRATEGY_WITHDRAW_FEE_TOKEN_FIELD]: transaction.fee.defaultCurrency.ticker
    },
    validationSchema: strategyWithdrawSchema('withdraw', {
      maxAmount,
      minAmount
    }),
    onSubmit: handleSubmit,
    onComplete: (values: StrategyWithdrawFormData) => {
      const transactionData = getTransactionArgs(values);

      if (!transactionData) return;

      const { monetaryAmount } = transactionData;

      const isWithdrawAll = isMaxAmount(monetaryAmount);

      if (isWithdrawAll) {
        return transaction.fee.estimate(Transaction.STRATEGIES_ALL_WITHDRAW, monetaryAmount.currency);
      } else {
        return transaction.fee.estimate(Transaction.STRATEGIES_WITHDRAW, monetaryAmount.currency, monetaryAmount);
      }
    }
  });

  const inputMonetaryAmount = newSafeMonetaryAmount(
    form.values[STRATEGY_WITHDRAW_AMOUNT_FIELD] || 0,
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
          aria-label={t('forms.field_amount', { field: t('withdraw') })}
          balance={maxAmount.toString()}
          humanBalance={maxAmount.toString()}
          balanceLabel={t('available')}
          valueUSD={inputUSDValue}
          {...mergeProps(form.getFieldProps(STRATEGY_WITHDRAW_AMOUNT_FIELD))}
        />
        <Flex direction='column' gap='spacing4'>
          <TransactionFeeDetails
            fee={transaction.fee}
            selectProps={{ ...form.getSelectFieldProps(STRATEGY_WITHDRAW_FEE_TOKEN_FIELD) }}
          />
          <AuthCTA type='submit' size='large' disabled={isSubmitButtonDisabled} loading={transaction.isLoading}>
            {t('withdraw')}
          </AuthCTA>
        </Flex>
      </Flex>
    </form>
  );
};

export { StrategyWithdrawalForm };
