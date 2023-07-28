import { MonetaryAmount } from '@interlay/monetary-js';
import { mergeProps } from '@react-aria/utils';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, newSafeMonetaryAmount } from '@/common/utils/utils';
import { Flex, TokenInput } from '@/component-library';
import { AuthCTA, TransactionFeeDetails } from '@/components';
import { WRAPPED_TOKEN, WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import { useGetPrices } from '@/hooks/api/use-get-prices';
import { Transaction, useTransaction } from '@/hooks/transaction';
import { isFormDisabled, StrategySchema, useForm } from '@/lib/form';
import {
  STRATEGY_WITHDRAW_AMOUNT_FIELD,
  STRATEGY_WITHDRAW_FEE_TOKEN_FIELD,
  StrategyWithdrawFormData
} from '@/lib/form/schemas/strategies';
import { useStrategyFormData } from '@/pages/Strategies/hooks/use-strategy-form-data';

import { StrategyType } from '../../types';

type StrategyWithdrawalFormProps = {
  type: StrategyType;
};

const StrategyWithdrawalForm = ({ type }: StrategyWithdrawalFormProps): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();
  const transaction = useTransaction(Transaction.LOANS_WITHDRAW);
  const { maxAmount, minAmount } = useStrategyFormData(type, 'withdraw');

  const handleSubmit = (values: StrategyWithdrawFormData) => {
    const amount = values[STRATEGY_WITHDRAW_AMOUNT_FIELD];

    if (!amount) {
      return;
    }

    const monetaryAmount = new MonetaryAmount(WRAPPED_TOKEN, amount);

    transaction.execute(WRAPPED_TOKEN, monetaryAmount);
  };

  const form = useForm<StrategyWithdrawFormData>({
    initialValues: {
      [STRATEGY_WITHDRAW_AMOUNT_FIELD]: '',
      [STRATEGY_WITHDRAW_FEE_TOKEN_FIELD]: transaction.fee.defaultCurrency.ticker
    },
    validationSchema: StrategySchema(STRATEGY_WITHDRAW_AMOUNT_FIELD, 'withdraw', {
      maxAmount,
      minAmount
    }),
    onSubmit: handleSubmit,
    onComplete: (values: StrategyWithdrawFormData) => {
      const amount = values[STRATEGY_WITHDRAW_AMOUNT_FIELD];

      if (!amount) {
        return;
      }

      const monetaryAmount = new MonetaryAmount(WRAPPED_TOKEN, amount);

      transaction.fee.estimate(WRAPPED_TOKEN, monetaryAmount);
    }
  });

  const inputMonetaryAmount = newSafeMonetaryAmount(
    form.values[STRATEGY_WITHDRAW_AMOUNT_FIELD] || 0,
    WRAPPED_TOKEN,
    true
  );
  const inputUSDValue = convertMonetaryAmountToValueInUSD(inputMonetaryAmount, prices?.[WRAPPED_TOKEN_SYMBOL].usd);
  const isSubmitButtonDisabled = isFormDisabled(form);

  return (
    <form onSubmit={form.handleSubmit}>
      <Flex direction='column' justifyContent='space-between'>
        <TokenInput
          placeholder='0.00'
          ticker={WRAPPED_TOKEN_SYMBOL}
          aria-label={t('forms.field_amount', { field: t('withdraw') })}
          balance={maxAmount.toString()}
          humanBalance={maxAmount.toString()}
          balanceLabel={t('available')}
          valueUSD={inputUSDValue ?? undefined}
          {...mergeProps(form.getFieldProps(STRATEGY_WITHDRAW_AMOUNT_FIELD))}
        />
        <Flex direction='column'>
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
