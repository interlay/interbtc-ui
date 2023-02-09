import { newMonetaryAmount, PooledCurrencies } from '@interlay/interbtc-api';
import Big from 'big.js';
import { TFunction, useTranslation } from 'react-i18next';

import { GOVERNANCE_TOKEN, TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import balance from '@/lib/form-validation/common/balance';
import field from '@/lib/form-validation/common/field';
import { CommonSchemaParams, MaxAmountSchemaParams } from '@/lib/form-validation/types';
import { transformNaN } from '@/lib/form-validation/utils';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';

type PoolDepositSchemaParams = CommonSchemaParams & MaxAmountSchemaParams;

const validateField = (value: number, params: PoolDepositSchemaParams, t: TFunction) => {
  const { governanceBalance, transactionFee, minAmount, maxAmount } = params;

  const newValue = transformNaN(value);

  if (!balance.transactionFee.validate({ availableBalance: governanceBalance, transactionFee })) {
    return balance.transactionFee.issue(t);
  }

  const inputAmount = new Big(newValue as number);

  if (!field.min.validate({ inputAmount, minAmount: minAmount.toBig() })) {
    const issueArg = field.min.issue(t, {
      action: t('deposit').toLowerCase(),
      amount: minAmount.toString()
    });
    return issueArg;
  }

  if (!field.max.validate({ inputAmount, maxAmount: maxAmount.toBig() })) {
    const issueArg = field.max.issue(t, {
      action: t('deposit').toLowerCase(),
      amount: maxAmount.toString()
    });
    return issueArg;
  }
};

type UseFormState = {
  errors: Record<string, string | undefined>;
  isComplete: boolean;
  isInvalid: boolean;
};

const useFormState = (values: Record<string, number | undefined>, pooledCurrencies: PooledCurrencies): UseFormState => {
  const { getAvailableBalance, getBalance } = useGetBalances();
  const { t } = useTranslation();

  const governanceBalance = getBalance(GOVERNANCE_TOKEN.ticker)?.free || newMonetaryAmount(0, GOVERNANCE_TOKEN);

  const errors: Record<string, string> = pooledCurrencies.reduce((acc, { currency }) => {
    const value = values[currency.ticker];

    if (value === undefined) return acc;

    const zeroAssetAmount = newMonetaryAmount(0, currency);
    const params: PoolDepositSchemaParams = {
      governanceBalance,
      maxAmount: getAvailableBalance(currency.ticker) || zeroAssetAmount,
      minAmount: newMonetaryAmount(1, currency),
      transactionFee: TRANSACTION_FEE_AMOUNT
    };
    const validation = validateField(value, params, t);

    if (!validation?.message) return acc;

    return { ...acc, [currency.ticker]: validation?.message };
  }, {});

  return {
    errors,
    isComplete: Object.values(values).filter((val) => val !== undefined).length === pooledCurrencies.length,
    isInvalid: !!Object.keys(errors).length
  };
};

export { useFormState };
