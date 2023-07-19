import { CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { mergeProps } from '@react-aria/utils';
import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { convertMonetaryAmountToValueInUSD, newSafeMonetaryAmount } from '@/common/utils/utils';
import { Flex, Input, TokenInput } from '@/component-library';
import { AuthCTA, TransactionFeeDetails } from '@/components';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { useForm } from '@/lib/form';
import {
  TRANSFER_AMOUNT_FIELD,
  TRANSFER_FEE_TOKEN_FIELD,
  TRANSFER_RECIPIENT_FIELD,
  TRANSFER_TOKEN_FIELD,
  TransferFormData,
  transferSchema,
  TransferValidationParams
} from '@/lib/form/schemas';
import { getTokenInputProps } from '@/utils/helpers/input';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetCurrencies } from '@/utils/hooks/api/use-get-currencies';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { Transaction, useTransaction } from '@/utils/hooks/transaction';
import { isTransactionFormDisabled } from '@/utils/hooks/transaction/utils/form';
import { useSelectCurrency } from '@/utils/hooks/use-select-currency';

type TransferFormProps = {
  ticker?: string;
};

const TransferForm = ({ ticker }: TransferFormProps): JSX.Element => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const prices = useGetPrices();
  const { data: currencies, getCurrencyFromTicker } = useGetCurrencies(bridgeLoaded);
  const { getAvailableBalance } = useGetBalances();
  const { items: selectItems } = useSelectCurrency();

  const [transferToken, setTransferToken] = useState<CurrencyExt>(GOVERNANCE_TOKEN);

  const transaction = useTransaction(Transaction.TOKENS_TRANSFER, {
    onSuccess: () => {
      form.resetForm();
    }
  });

  const transferTokenBalance = transferToken && getAvailableBalance(transferToken.ticker);

  const minAmount = transferToken && newMonetaryAmount(1, transferToken);

  const transferSchemaParams: TransferValidationParams = {
    [TRANSFER_AMOUNT_FIELD]: {
      maxAmount: transferTokenBalance,
      minAmount
    }
  };

  const getTransactionArgs = useCallback(
    (values: TransferFormData) => {
      const destination = values[TRANSFER_RECIPIENT_FIELD];
      const feeTicker = values[TRANSFER_FEE_TOKEN_FIELD];

      if (!destination) return;

      const amount = newMonetaryAmount(values[TRANSFER_AMOUNT_FIELD] || 0, transferToken, true);

      return { destination, amount, feeTicker };
    },
    [transferToken]
  );

  const handleSubmit = async (values: TransferFormData) => {
    const transactionData = getTransactionArgs(values);

    if (!transactionData) return;

    let { amount, destination } = transactionData;

    if (transaction.fee.isEqualFeeCurrency(amount.currency)) {
      amount = transaction.calculateAmountWithFeeDeducted(amount);
    }

    transaction.execute(destination, amount);
  };

  const initialValues = useMemo(
    () => ({
      [TRANSFER_RECIPIENT_FIELD]: '',
      [TRANSFER_AMOUNT_FIELD]: '',
      [TRANSFER_TOKEN_FIELD]: transferToken.ticker || '',
      [TRANSFER_FEE_TOKEN_FIELD]: transaction.fee.defaultCurrency.ticker
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const form = useForm<TransferFormData>({
    initialValues,
    validationSchema: transferSchema(transferSchemaParams),
    onSubmit: handleSubmit,
    hideErrorMessages: transaction.isLoading,
    onComplete: (values) => {
      const transactionData = getTransactionArgs(values);

      if (!transactionData) return;

      const { amount, destination } = transactionData;

      transaction.fee.estimate(destination, amount);
    }
  });

  useEffect(() => {
    if (!currencies || !ticker) return;

    const currency = getCurrencyFromTicker(ticker);

    setTransferToken(currency);
    form.setFieldValue(TRANSFER_TOKEN_FIELD, ticker);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencies, getCurrencyFromTicker, ticker]);

  const handleTickerChange = (ticker: string, name: string) => {
    form.setFieldValue(name, ticker, true);
    const currency = getCurrencyFromTicker(ticker);
    setTransferToken(currency);
  };

  const transferMonetaryAmount = newSafeMonetaryAmount(form.values[TRANSFER_AMOUNT_FIELD] || 0, transferToken, true);
  const transferAmountUSD = transferMonetaryAmount
    ? convertMonetaryAmountToValueInUSD(
        transferMonetaryAmount,
        getTokenPrice(prices, transferMonetaryAmount.currency.ticker)?.usd
      ) || 0
    : 0;

  const isBtnDisabled = isTransactionFormDisabled(form, transaction.fee);

  return (
    <Flex direction='column'>
      <form onSubmit={form.handleSubmit}>
        <Flex direction='column' gap='spacing8'>
          <Flex direction='column' gap='spacing4'>
            <TokenInput
              placeholder='0.00'
              label='Amount'
              valueUSD={transferAmountUSD}
              selectProps={mergeProps(form.getSelectFieldProps(TRANSFER_TOKEN_FIELD, true), {
                onSelectionChange: (ticker: Key) => handleTickerChange(ticker as string, TRANSFER_TOKEN_FIELD),
                items: selectItems
              })}
              {...mergeProps(
                form.getFieldProps(TRANSFER_AMOUNT_FIELD, false, true),
                getTokenInputProps(transferTokenBalance)
              )}
            />
            <Input
              placeholder='Enter recipient account'
              label='Recipient'
              padding={{ top: 'spacing5', bottom: 'spacing5' }}
              {...mergeProps(form.getFieldProps(TRANSFER_RECIPIENT_FIELD, false, true))}
            />
          </Flex>
          <Flex direction='column' gap='spacing4'>
            <TransactionFeeDetails
              fee={transaction.fee}
              selectProps={form.getSelectFieldProps(TRANSFER_FEE_TOKEN_FIELD)}
            />
            <AuthCTA type='submit' disabled={isBtnDisabled} size='large' loading={transaction.isLoading}>
              Transfer
            </AuthCTA>
          </Flex>
        </Flex>
      </form>
    </Flex>
  );
};

export { TransferForm };
