import { LiquidityPool, newMonetaryAmount } from '@interlay/interbtc-api';
import Big from 'big.js';
import { RefObject, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, newSafeMonetaryAmount } from '@/common/utils/utils';
import { Flex, TokenInput } from '@/component-library';
import { AuthCTA, ReceivableAssets, TransactionFeeDetails } from '@/components';
import { GOVERNANCE_TOKEN, TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import { isFormDisabled, POOL_WITHDRAW_AMOUNT_FIELD, POOL_WITHDRAW_FEE_TOKEN_FIELD, useForm } from '@/lib/form';
import { WithdrawLiquidityPoolFormData, withdrawLiquidityPoolSchema } from '@/lib/form/schemas';
import { SlippageManager } from '@/pages/AMM/shared/components';
import { AMM_DEADLINE_INTERVAL } from '@/utils/constants/api';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { Transaction, useTransaction } from '@/utils/hooks/transaction';
import useAccountId from '@/utils/hooks/use-account-id';

import { PoolName } from '../PoolName';

type WithdrawFormProps = {
  pool: LiquidityPool;
  overlappingModalRef: RefObject<HTMLDivElement>;
  onSuccess?: () => void;
  onSigning?: () => void;
};

const WithdrawForm = ({ pool, overlappingModalRef, onSuccess, onSigning }: WithdrawFormProps): JSX.Element => {
  const [slippage, setSlippage] = useState<number>(0.1);

  const accountId = useAccountId();
  const { t } = useTranslation();
  const prices = useGetPrices();
  const { getBalance } = useGetBalances();

  const transaction = useTransaction(Transaction.AMM_REMOVE_LIQUIDITY, {
    onSuccess,
    onSigning
  });

  const { lpToken } = pool;

  const governanceBalance = getBalance(GOVERNANCE_TOKEN.ticker)?.free || newMonetaryAmount(0, GOVERNANCE_TOKEN);
  const balance = getBalance(lpToken.ticker)?.reserved;

  const zeroAssetAmount = newMonetaryAmount(0, lpToken);
  const schemaParams = {
    governanceBalance,
    maxAmount: balance || zeroAssetAmount,
    minAmount: newMonetaryAmount(1, lpToken),
    transactionFee: TRANSACTION_FEE_AMOUNT
  };

  const getTransactionArgs = useCallback(
    async (values: WithdrawLiquidityPoolFormData) => {
      if (!accountId) return;

      try {
        const amount = newMonetaryAmount(values[POOL_WITHDRAW_AMOUNT_FIELD] || 0, lpToken, true);
        const deadline = await window.bridge.system.getFutureBlockNumber(AMM_DEADLINE_INTERVAL);

        return { amount, pool, slippage, deadline, accountId };
      } catch (error: any) {
        transaction.reject(error);
      }
    },
    [accountId, lpToken, pool, slippage, transaction]
  );

  const handleSubmit = async (data: WithdrawLiquidityPoolFormData) => {
    const transactionData = await getTransactionArgs(data);

    if (!transactionData) return;

    const { accountId, amount, deadline, pool } = transactionData;

    return transaction.execute(amount, pool, slippage, deadline, accountId);
  };

  const form = useForm<WithdrawLiquidityPoolFormData>({
    initialValues: {
      [POOL_WITHDRAW_AMOUNT_FIELD]: '',
      [POOL_WITHDRAW_FEE_TOKEN_FIELD]: transaction.fee.defaultCurrency.ticker
    },
    validationSchema: withdrawLiquidityPoolSchema(schemaParams),
    onSubmit: handleSubmit,
    onComplete: async (values) => {
      const transactionData = await getTransactionArgs(values);

      if (!transactionData) return;

      const { accountId, amount, deadline, pool } = transactionData;

      const feeTicker = values[POOL_WITHDRAW_FEE_TOKEN_FIELD];

      return transaction.fee.setCurrency(feeTicker).estimate(amount, pool, slippage, deadline, accountId);
    }
  });

  const lpTokenMonetaryAmount = newSafeMonetaryAmount(form.values[POOL_WITHDRAW_AMOUNT_FIELD] || 0, pool.lpToken, true);

  const isBtnDisabled = isFormDisabled(form);

  const tickers = pool.pooledCurrencies.map((currency) => currency.currency.ticker);
  const poolName = <PoolName justifyContent='center' tickers={tickers} />;

  const pooledAmounts = pool.getLiquidityWithdrawalPooledCurrencyAmounts(lpTokenMonetaryAmount as any);

  const pooledAmountsUSD = pooledAmounts
    .reduce((acc, pooledAmount) => {
      const pooledAmountUSD = convertMonetaryAmountToValueInUSD(
        pooledAmount,
        getTokenPrice(prices, pooledAmount.currency.ticker)?.usd
      );

      return acc.add(pooledAmountUSD || 0);
    }, new Big(0))
    .toNumber();

  return (
    <form onSubmit={form.handleSubmit}>
      <Flex direction='column'>
        <SlippageManager ref={overlappingModalRef} value={slippage} onChange={(slippage) => setSlippage(slippage)} />
        {poolName}
        <Flex direction='column' gap='spacing8'>
          <Flex direction='column'>
            <TokenInput
              placeholder='0.00'
              ticker={{ icons: tickers, text: 'LP Token' }}
              aria-label={t('forms.field_amount', {
                field: t('withdraw').toLowerCase()
              })}
              balance={balance?.toString() || 0}
              humanBalance={balance?.toHuman() || 0}
              valueUSD={pooledAmountsUSD}
              errorMessage={form.errors[POOL_WITHDRAW_AMOUNT_FIELD]}
              {...form.getFieldProps(POOL_WITHDRAW_AMOUNT_FIELD)}
            />
          </Flex>
          <ReceivableAssets assetAmounts={pooledAmounts} prices={prices} />
          <TransactionFeeDetails
            {...transaction.fee.detailsProps}
            selectProps={{ ...form.getFieldProps(POOL_WITHDRAW_FEE_TOKEN_FIELD), modalRef: overlappingModalRef }}
          />
          <AuthCTA type='submit' size='large' disabled={isBtnDisabled}>
            {t('amm.pools.remove_liquidity')}
          </AuthCTA>
        </Flex>
      </Flex>
    </form>
  );
};

WithdrawForm.displayName = 'WithdrawForm';

export { WithdrawForm };
export type { WithdrawFormProps };
