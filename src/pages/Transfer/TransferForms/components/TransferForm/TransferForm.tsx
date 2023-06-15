import { CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { mergeProps } from '@react-aria/utils';
import { Key, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { convertMonetaryAmountToValueInUSD, newSafeMonetaryAmount } from '@/common/utils/utils';
import { Flex, Input, TokenInput } from '@/component-library';
import { AuthCTA, TransactionFeeDetails } from '@/components';
import { GOVERNANCE_TOKEN, TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import { isFormDisabled, useForm } from '@/lib/form';
import {
  TRANSFER_AMOUNT_FIELD,
  TRANSFER_RECIPIENT_FIELD,
  TRANSFER_TOKEN_FIELD,
  TransferFormData,
  transferSchema
} from '@/lib/form/schemas';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetCurrencies } from '@/utils/hooks/api/use-get-currencies';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { Transaction, useTransaction } from '@/utils/hooks/transaction';
import { useSelectCurrency } from '@/utils/hooks/use-select-currency';

const TransferForm = (): JSX.Element => {
  const { t } = useTranslation();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const prices = useGetPrices();
  const { getCurrencyFromTicker } = useGetCurrencies(bridgeLoaded);
  const { getBalance, getAvailableBalance } = useGetBalances();
  const { items: selectItems } = useSelectCurrency();

  const [transferToken, setTransferToken] = useState<CurrencyExt>(GOVERNANCE_TOKEN);

  const transaction = useTransaction(Transaction.TOKENS_TRANSFER, {
    onSuccess: () => {
      form.resetForm();
    }
  });

  const transferTokenBalance = transferToken && getAvailableBalance(transferToken.ticker);

  const governanceBalance = getBalance(GOVERNANCE_TOKEN.ticker)?.free || newMonetaryAmount(0, GOVERNANCE_TOKEN);
  const minAmount = transferToken && newMonetaryAmount(1, transferToken);

  const transferAmountSchemaParams = {
    governanceBalance,
    maxAmount: transferTokenBalance,
    minAmount,
    transactionFee: TRANSACTION_FEE_AMOUNT
  };

  const handleSubmit = async (values: TransferFormData) => {
    const destination = values[TRANSFER_RECIPIENT_FIELD];

    if (!destination) return;

    const amount = newMonetaryAmount(values[TRANSFER_AMOUNT_FIELD] || 0, transferToken, true);

    transaction.execute(destination, amount);
  };

  const initialValues = useMemo(
    () => ({
      [TRANSFER_RECIPIENT_FIELD]: '',
      [TRANSFER_AMOUNT_FIELD]: '',
      [TRANSFER_TOKEN_FIELD]: transferToken.ticker || ''
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const form = useForm<TransferFormData>({
    initialValues,
    validationSchema: transferSchema({ [TRANSFER_AMOUNT_FIELD]: transferAmountSchemaParams }, t),
    onSubmit: handleSubmit,
    showErrorMessages: !transaction.isLoading
  });

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

  const isBtnDisabled = isFormDisabled(form);

  return (
    <Flex direction='column'>
      <form onSubmit={form.handleSubmit}>
        <Flex direction='column' gap='spacing8'>
          <Flex direction='column' gap='spacing4'>
            <TokenInput
              placeholder='0.00'
              label='Amount'
              balance={transferTokenBalance?.toString() || 0}
              humanBalance={transferTokenBalance?.toHuman() || 0}
              valueUSD={transferAmountUSD}
              selectProps={mergeProps(form.getFieldProps(TRANSFER_TOKEN_FIELD, false), {
                onSelectionChange: (ticker: Key) => handleTickerChange(ticker as string, TRANSFER_TOKEN_FIELD),
                items: selectItems
              })}
              {...mergeProps(form.getFieldProps(TRANSFER_AMOUNT_FIELD))}
            />
            <Input
              placeholder='Enter recipient account'
              label='Recipient'
              padding={{ top: 'spacing5', bottom: 'spacing5' }}
              {...mergeProps(form.getFieldProps(TRANSFER_RECIPIENT_FIELD))}
            />
          </Flex>
          <Flex direction='column' gap='spacing4'>
            <TransactionFeeDetails amount={TRANSACTION_FEE_AMOUNT} />
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
