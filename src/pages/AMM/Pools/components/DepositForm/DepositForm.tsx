import { CurrencyExt, LiquidityPool, newMonetaryAmount, PooledCurrencies } from '@interlay/interbtc-api';
import { AccountId } from '@polkadot/types/interfaces';
import Big from 'big.js';
import { ChangeEventHandler, FormEventHandler, Key, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat, formatNumber, formatUSD } from '@/common/utils/utils';
import { Dd, Dl, DlGroup, Dt, Flex, P, TokenInput } from '@/component-library';
import { AuthCTA } from '@/components/AuthCTA';
import { GOVERNANCE_TOKEN, TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import balance from '@/lib/form-validation/common/balance';
import field from '@/lib/form-validation/common/field';
import { CommonSchemaParams, MaxAmountSchemaParams } from '@/lib/form-validation/types';
import { SlippageManager } from '@/pages/AMM/shared/components';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { PoolName } from '../PoolName';
import { DepositDivider } from './DepositDivider';
import { StyledDl } from './DepositForm.styles';

type PoolDepositSchemaParams = CommonSchemaParams & MaxAmountSchemaParams;

const validateField = (value: number | undefined, params: PoolDepositSchemaParams, t: TFunction) => {
  const { governanceBalance, transactionFee, minAmount, maxAmount } = params;

  if (!balance.transactionFee.validate({ availableBalance: governanceBalance, transactionFee })) {
    return balance.transactionFee.issue(t);
  }

  const inputAmount = new Big(value as number);

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

const useFormState = (values: Record<string, number | undefined>, pooledCurrencies: PooledCurrencies) => {
  const { getAvailableBalance, getBalance } = useGetBalances();
  const { t } = useTranslation();

  const governanceBalance = getBalance(GOVERNANCE_TOKEN.ticker)?.free || newMonetaryAmount(0, GOVERNANCE_TOKEN);

  const errors: Record<string, string> = pooledCurrencies.reduce((acc, curr) => {
    const value = values[curr.currency.ticker];

    if (!value) return acc;

    const zeroAssetAmount = newMonetaryAmount(0, curr.currency);
    const params: PoolDepositSchemaParams = {
      governanceBalance,
      maxAmount: getAvailableBalance(curr.currency.ticker) || zeroAssetAmount,
      minAmount: newMonetaryAmount(1, curr.currency),
      transactionFee: TRANSACTION_FEE_AMOUNT
    };
    const validation = validateField(value, params, t);

    if (!validation?.message) return acc;

    return { ...acc, [curr.currency.ticker]: validation?.message };
  }, {});

  return {
    errors,
    isComplete: Object.values(values).filter((val) => val !== undefined).length === pooledCurrencies.length,
    isInvalid: !!Object.keys(errors).length
  };
};

type DepositData = {
  amounts: PooledCurrencies;
  pool: LiquidityPool;
  slippage: number;
  deadline: number;
  accountId: AccountId;
};

const mutateDeposit = ({ amounts, pool, slippage, deadline, accountId }: DepositData) =>
  window.bridge.amm.addLiquidity(amounts, pool, slippage, deadline, accountId);

type DepositFormProps = {
  pool: LiquidityPool;
  accountId: AccountId;
  onDeposit?: () => void;
};

const DepositForm = ({ pool, accountId, onDeposit }: DepositFormProps): JSX.Element => {
  const { t } = useTranslation();
  const { getAvailableBalance } = useGetBalances();
  const prices = useGetPrices();
  const [slippage, setSlippage] = useState<Key>('0.1');

  const { pooledCurrencies } = pool;

  const defaultValues = pooledCurrencies.reduce((acc, val) => ({ ...acc, [val.currency.ticker]: undefined }), {});
  const [values, setValues] = useState<Record<string, number | undefined>>(defaultValues);
  const { errors, isInvalid, isComplete } = useFormState(values, pooledCurrencies);

  const depositMutation = useMutation<void, Error, DepositData>(mutateDeposit, {
    onSuccess: () => {
      onDeposit?.();
      toast.success('Deposit successful');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.value) {
      return setValues(defaultValues);
    }

    const inputCurrency = pooledCurrencies.find((currency) => currency.currency.ticker === e.target.name);

    const inputAmount = newMonetaryAmount(e.target.value || 0, inputCurrency?.currency as CurrencyExt, true);
    const amounts = pool.getLiquidityDepositInputAmounts(inputAmount);

    setValues(
      amounts.reduce((acc, val) => {
        if (val.currency.ticker === inputCurrency?.currency.ticker) {
          return { ...acc, [val.currency.ticker]: e.target.value ? Number(e.target.value) : undefined };
        }

        return { ...acc, [val.currency.ticker]: val.toBig().toNumber() };
      }, {})
    );
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      const amounts = pooledCurrencies.map((currency) =>
        newMonetaryAmount(values[currency.currency.ticker] || 0, currency.currency, true)
      );

      const deadline = await window.bridge.system.getFutureBlockNumber(30 * 60);

      return depositMutation.mutate({ amounts, pool, slippage: Number(slippage), deadline, accountId });
    } catch (err: any) {
      toast.error(err.toString());
    }
  };

  const poolName = (
    <PoolName justifyContent='center' tickers={pooledCurrencies.map((currency) => currency.currency.ticker)} />
  );

  const lpTokenAmount = pool.getLiquidityDepositLpTokenAmount(
    newMonetaryAmount(values[pooledCurrencies[0].currency.ticker] || 0, pooledCurrencies[0].currency, true)
  );

  const lpTokenAmountUSD = pooledCurrencies
    .reduce(
      (acc, curr) =>
        acc.add(
          new Big(values[curr.currency.ticker] || 0)
            .mul(getTokenPrice(prices, curr.currency.ticker)?.usd || 0)
            .toNumber()
        ),
      new Big(0)
    )
    .toNumber();

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction='column'>
        <SlippageManager value={slippage} onChange={(slippage) => setSlippage(slippage)} />
        {poolName}
        <Flex direction='column' gap='spacing8'>
          <Flex direction='column' gap='spacing2'>
            {pooledCurrencies.map((amount, index) => {
              const {
                currency: { ticker, humanDecimals }
              } = amount;

              return (
                <Flex key={ticker} direction='column' gap='spacing8'>
                  <TokenInput
                    placeholder='0.00'
                    ticker={ticker}
                    aria-label={t('forms.field_amount', {
                      field: `${ticker} ${t('deposit').toLowerCase()}`
                    })}
                    balance={getAvailableBalance(ticker)?.toBig().toNumber() || 0}
                    balanceDecimals={humanDecimals}
                    valueUSD={new Big(values[ticker] || 0).mul(getTokenPrice(prices, ticker)?.usd || 0).toNumber()}
                    value={values[ticker]}
                    name={ticker}
                    onChange={handleChange}
                    errorMessage={errors[ticker]}
                  />
                  {index !== pooledCurrencies.length - 1 && <DepositDivider />}
                </Flex>
              );
            })}
          </Flex>
          <Flex direction='column' gap='spacing4'>
            <P align='center' size='xs'>
              {t('amm.pools.receivable_assets')}
            </P>
            <Dl direction='column' gap='spacing2'>
              <DlGroup justifyContent='space-between'>
                <Dt size='xs' color='primary'>
                  {poolName}
                </Dt>
                <Dd size='xs'>
                  {formatNumber(lpTokenAmount.toBig().toNumber(), {
                    maximumFractionDigits: lpTokenAmount.currency.humanDecimals,
                    compact: true
                  })}{' '}
                  ({formatUSD(lpTokenAmountUSD, { compact: true })})
                </Dd>
              </DlGroup>
            </Dl>
          </Flex>
          <StyledDl direction='column' gap='spacing2'>
            <DlGroup justifyContent='space-between'>
              <Dt size='xs' color='primary'>
                Fees
              </Dt>
              <Dd size='xs'>
                {displayMonetaryAmount(TRANSACTION_FEE_AMOUNT)} {TRANSACTION_FEE_AMOUNT.currency.ticker} (
                {displayMonetaryAmountInUSDFormat(
                  TRANSACTION_FEE_AMOUNT,
                  getTokenPrice(prices, TRANSACTION_FEE_AMOUNT.currency.ticker)?.usd
                )}
                )
              </Dd>
            </DlGroup>
          </StyledDl>
          <AuthCTA type='submit' size='large' disabled={!isComplete || isInvalid} loading={depositMutation.isLoading}>
            {t('amm.pools.add_liquidity')}
          </AuthCTA>
        </Flex>
      </Flex>
    </form>
  );
};

DepositForm.displayName = 'DepositForm';

export { DepositForm };
export type { DepositFormProps };
