import { newMonetaryAmount } from '@interlay/interbtc-api';
import { mergeProps } from '@react-aria/utils';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, newSafeMonetaryAmount } from '@/common/utils/utils';
import { Flex, Slider, TokenInput } from '@/component-library';
import {
  AuthCTA,
  TransactionDetails,
  TransactionDetailsDd,
  TransactionDetailsDt,
  TransactionDetailsGroup,
  TransactionFeeDetails
} from '@/components';
import { WRAPPED_TOKEN } from '@/config/relay-chains';
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
import { useGetStrategyAvailableAmounts } from '../../hooks/use-get-strategy-available-amounts';
import { StrategyPositionData } from '../../hooks/use-get-strategy-position';
import { StrategyFormType, StrategyType } from '../../types';

type StrategyDepositFormProps = {
  strategy: StrategyData;
  position?: StrategyPositionData;
};

const StrategyDepositForm = ({ strategy, position }: StrategyDepositFormProps): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();
  const transaction = useTransaction(Transaction.STRATEGIES_DEPOSIT, {
    onSuccess: () => {
      form.resetForm();
    }
  });
  const {
    data: { maxAmount, minAmount }
  } = useGetStrategyAvailableAmounts(StrategyFormType.DEPOSIT, strategy, position);

  const { currencies } = strategy;

  const getTransactionArgs = useCallback(
    (values: StrategyDepositFormData) => {
      const amount = values[STRATEGY_DEPOSIT_AMOUNT_FIELD] || 0;
      const monetaryAmount = newMonetaryAmount(amount, currencies.primary, true);

      return { monetaryAmount };
    },
    [currencies]
  );

  const handleSubmit = (values: StrategyDepositFormData) => {
    const transactionData = getTransactionArgs(values);

    if (!transactionData) return;

    const { monetaryAmount } = transactionData;

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
      const transactionData = getTransactionArgs(values);

      if (!transactionData) return;

      const { monetaryAmount } = transactionData;

      transaction.fee.estimate(WRAPPED_TOKEN, monetaryAmount);
    }
  });

  const depositMonetaryAmount = newSafeMonetaryAmount(
    form.values[STRATEGY_DEPOSIT_AMOUNT_FIELD] || 0,
    currencies.primary,
    true
  );
  const depositUSDValue =
    convertMonetaryAmountToValueInUSD(depositMonetaryAmount, prices?.[currencies.primary.ticker].usd) || 0;
  const isSubmitButtonDisabled = isFormDisabled(form);

  return (
    <form onSubmit={form.handleSubmit}>
      <Flex marginTop='spacing4' direction='column' gap='spacing8' justifyContent='space-between'>
        <TokenInput
          placeholder='0.00'
          ticker={currencies.primary.ticker}
          aria-label={t('forms.field_amount', { field: t('deposit') })}
          balance={maxAmount.toString()}
          humanBalance={maxAmount.toString()}
          valueUSD={depositUSDValue}
          {...mergeProps(form.getFieldProps(STRATEGY_DEPOSIT_AMOUNT_FIELD))}
        />
        {strategy.type === StrategyType.LEVERAGE_LONG && (
          <>
            <TokenInput
              isDisabled
              placeholder='0.00'
              ticker={strategy.currencies.secondary.ticker}
              aria-label={t('forms.field_amount', { field: t('borrow') })}
              valueUSD={depositUSDValue}
              // {...mergeProps(form.getFieldProps(STRATEGY_DEPOSIT_AMOUNT_FIELD))}
            />
            <Slider label='Leverage' step={1} minValue={1} maxValue={5} marks renderMarkText={(text) => `${text}x`} />
          </>
        )}
        <Flex direction='column' gap='spacing4'>
          <TransactionDetails>
            <TransactionDetailsGroup>
              <TransactionDetailsDt>Available liquidity</TransactionDetailsDt>
              <TransactionDetailsDd>{amountLabel}</TransactionDetailsDd>
            </TransactionDetailsGroup>
          </TransactionDetails>
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
