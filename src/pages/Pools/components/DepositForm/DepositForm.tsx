import { CurrencyExt, LiquidityPool, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { mergeProps } from '@react-aria/utils';
import Big from 'big.js';
import { ChangeEventHandler, Fragment, RefObject, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { newSafeMonetaryAmount } from '@/common/utils/utils';
import { Alert, Flex } from '@/component-library';
import { AuthCTA, SlippageManager, TransactionFeeDetails } from '@/components';
import {
  DepositLiquidityPoolFormData,
  depositLiquidityPoolSchema,
  DepositLiquidityPoolValidationParams,
  POOL_DEPOSIT_FEE_TOKEN_FIELD,
  useForm
} from '@/lib/form';
import { AMM_DEADLINE_INTERVAL } from '@/utils/constants/api';
import { getTokenInputProps } from '@/utils/helpers/input';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { Transaction, useTransaction } from '@/utils/hooks/transaction';
import { isTransactionFormDisabled } from '@/utils/hooks/transaction/utils/form';
import useAccountId from '@/utils/hooks/use-account-id';

import { PoolName } from '../PoolName';
import { StyledPlusDivider, StyledTokenInput } from './DepositForm.styles';
import { DepositOutputAssets } from './DepositOutputAssets';

const isCustomAmountsMode = (form: ReturnType<typeof useForm>, pool: LiquidityPool) =>
  // If pool has no liquidity, the assets ratio is set by the user,
  // therefore the value inputted is directly used.
  (form.dirty && Object.values(form.touched).filter(Boolean).length > 0) || pool.isEmpty;

type DepositFormProps = {
  pool: LiquidityPool;
  overlappingModalRef: RefObject<HTMLDivElement>;
  onSuccess?: () => void;
  onSigning?: () => void;
};

const DepositForm = ({ pool, overlappingModalRef, onSuccess, onSigning }: DepositFormProps): JSX.Element => {
  const { pooledCurrencies } = pool;

  const [slippage, setSlippage] = useState(0.1);

  const [isCustomMode, setCustomMode] = useState(false);

  const accountId = useAccountId();
  const { t } = useTranslation();
  const { getAvailableBalance } = useGetBalances();
  const prices = useGetPrices();

  const transaction = useTransaction(Transaction.AMM_ADD_LIQUIDITY, {
    onSuccess,
    onSigning
  });

  const getAmounts = useCallback(
    (amounts: MonetaryAmount<CurrencyExt>[]) => {
      const feeCurrencyAmount = amounts.find((amount) => transaction.fee.isEqualFeeCurrency(amount.currency));

      if (feeCurrencyAmount && transaction.fee.data) {
        const newFeeCurrencyAmount = transaction.calculateFeeAffectAmount(feeCurrencyAmount);

        if (isCustomMode) {
          return amounts.map((amount) =>
            transaction.fee.isEqualFeeCurrency(amount.currency) ? newFeeCurrencyAmount : amount
          );
        } else {
          return pool.getLiquidityDepositInputAmounts(newFeeCurrencyAmount);
        }
      }

      return amounts;
    },
    [isCustomMode, pool, transaction]
  );

  const getTransactionArgs = useCallback(
    async (values: DepositLiquidityPoolFormData) => {
      if (!accountId) return;

      const amounts: MonetaryAmount<CurrencyExt>[] = pooledCurrencies.map((amount) =>
        newSafeMonetaryAmount(values[amount.currency.ticker] || 0, amount.currency, true)
      );

      try {
        const deadline = await window.bridge.system.getFutureBlockNumber(AMM_DEADLINE_INTERVAL);

        return { amounts, pool, slippage, deadline, accountId };
      } catch (error: any) {
        transaction.reject(error);
      }
    },
    [accountId, pool, pooledCurrencies, slippage, transaction]
  );

  const handleSubmit = async (data: DepositLiquidityPoolFormData) => {
    const transactionData = await getTransactionArgs(data);

    if (!transactionData) return;

    const { accountId, amounts, deadline, pool } = transactionData;

    const newAmounts = getAmounts(amounts);

    newAmounts.forEach((amount) => console.log(amount.toString()));

    return transaction.execute(newAmounts, pool, slippage, deadline, accountId);
  };

  const tokens = useMemo(
    () =>
      pooledCurrencies.reduce(
        (acc: DepositLiquidityPoolValidationParams['tokens'], pooled) => ({
          ...acc,
          [pooled.currency.ticker]: {
            minAmount: newMonetaryAmount(1, pooled.currency),
            maxAmount: getAvailableBalance(pooled.currency.ticker) || newMonetaryAmount(0, pooled.currency)
          }
        }),
        {}
      ),
    [getAvailableBalance, pooledCurrencies]
  );

  const defaultValues = pooledCurrencies.reduce((acc, amount) => ({ ...acc, [amount.currency.ticker]: '' }), {});

  const initialValues = useMemo(
    () => ({ ...defaultValues, [POOL_DEPOSIT_FEE_TOKEN_FIELD]: transaction.fee.defaultCurrency.ticker }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const form = useForm<DepositLiquidityPoolFormData>({
    initialValues,
    validationSchema: depositLiquidityPoolSchema({ tokens }),
    onSubmit: handleSubmit,
    onComplete: async (values) => {
      const transactionData = await getTransactionArgs(values);

      if (!transactionData) return;

      const { accountId, amounts, deadline, pool } = transactionData;

      return transaction.fee.estimate(amounts, pool, slippage, deadline, accountId);
    }
  });

  const handleChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const isCustom = isCustomAmountsMode(form, pool);

    if (isCustom) {
      return setCustomMode(true);
    }

    if (!e.target.value || isNaN(Number(e.target.value))) {
      return form.setValues({ ...form.values, ...defaultValues });
    }

    const inputCurrency = pooledCurrencies.find((currency) => currency.currency.ticker === e.target.name);
    const inputAmount = newSafeMonetaryAmount(e.target.value || 0, inputCurrency?.currency as CurrencyExt, true);

    const amounts = pool.getLiquidityDepositInputAmounts(inputAmount);

    const newValues = amounts.reduce((acc, val) => {
      if (val.currency.ticker === inputCurrency?.currency.ticker) {
        return { ...acc, [val.currency.ticker]: e.target.value ? e.target.value : undefined };
      }

      return { ...acc, [val.currency.ticker]: val.toBig().toString() };
    }, {});

    form.setValues({ ...form.values, ...newValues });
  };

  const poolName = (
    <PoolName justifyContent='center' tickers={pooledCurrencies.map((amount) => amount.currency.ticker)} />
  );

  const isBtnDisabled = isTransactionFormDisabled(form, transaction.fee);

  return (
    <form onSubmit={form.handleSubmit}>
      <Flex direction='column'>
        <SlippageManager ref={overlappingModalRef} value={slippage} onChange={(slippage) => setSlippage(slippage)} />
        {poolName}
        <Flex direction='column' gap='spacing8'>
          <Flex direction='column'>
            {pooledCurrencies.map((amount, index) => {
              const {
                currency: { ticker }
              } = amount;

              const isLastItem = index === pooledCurrencies.length - 1;

              const balance = getAvailableBalance(ticker);

              return (
                <Fragment key={ticker}>
                  <StyledTokenInput
                    placeholder='0.00'
                    ticker={ticker}
                    aria-label={t('forms.field_amount', {
                      field: `${ticker} ${t('deposit').toLowerCase()}`
                    })}
                    valueUSD={new Big(isNaN(Number(form.values[ticker])) ? 0 : form.values[ticker] || 0)
                      .mul(getTokenPrice(prices, ticker)?.usd || 0)
                      .toNumber()}
                    {...mergeProps(form.getFieldProps(ticker, false, false), getTokenInputProps(balance), {
                      onChange: handleChange
                    })}
                  />
                  {!isLastItem && <StyledPlusDivider marginTop='spacing5' />}
                </Fragment>
              );
            })}
          </Flex>
          {pool.isEmpty ? (
            <Alert status='warning'>
              <p>{t('amm.pools.initial_rate_warning')}</p>
            </Alert>
          ) : (
            <DepositOutputAssets pool={pool} values={form.values} prices={prices} />
          )}
          <Flex direction='column' gap='spacing4'>
            <TransactionFeeDetails
              fee={transaction.fee}
              selectProps={{ ...form.getSelectFieldProps(POOL_DEPOSIT_FEE_TOKEN_FIELD), modalRef: overlappingModalRef }}
            />
            <AuthCTA type='submit' size='large' disabled={isBtnDisabled}>
              {t('amm.pools.add_liquidity')}
            </AuthCTA>
          </Flex>
        </Flex>
      </Flex>
    </form>
  );
};

DepositForm.displayName = 'DepositForm';

export { DepositForm };
export type { DepositFormProps };
