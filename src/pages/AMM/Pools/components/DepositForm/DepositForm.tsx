import { zodResolver } from '@hookform/resolvers/zod';
import { CurrencyExt, LiquidityPool, newMonetaryAmount, PooledCurrencies } from '@interlay/interbtc-api';
import { chain } from '@react-aria/utils';
import Big from 'big.js';
import { ChangeEventHandler } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import * as z from 'zod';

import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat, formatNumber } from '@/common/utils/utils';
import { Dd, Dl, DlGroup, Dt, Flex, P, TokenInput } from '@/component-library';
import { AuthCTA } from '@/components/AuthCTA';
import { GOVERNANCE_TOKEN, TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import validate, { PoolDepositSchemaParams } from '@/lib/form-validation';
import { getErrorMessage, isValidForm } from '@/utils/helpers/forms';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { PoolName } from '../PoolName';
import { DepositDivider } from './DepositDivider';
import { StyledDl } from './DepositForm.styles';

type DepositData = {
  amounts: PooledCurrencies;
  pool: LiquidityPool;
};

const mutateDeposit = ({ amounts, pool }: DepositData) => window.bridge.amm.addLiquidity(amounts, pool);

type DepositFormData = Record<string, number>;

type DepositFormProps = {
  pool: LiquidityPool;
  onChangePool?: () => void;
};

const DepositForm = ({ pool }: DepositFormProps): JSX.Element => {
  const { t } = useTranslation();
  const { getBalance, getAvailableBalance } = useGetBalances();
  const prices = useGetPrices();

  const depositMutation = useMutation<void, Error, DepositData>(mutateDeposit, {
    onSuccess: () => {
      toast.success('Deposit successful');
    }
  });

  const governanceBalance = getBalance(GOVERNANCE_TOKEN.ticker)?.free || newMonetaryAmount(0, GOVERNANCE_TOKEN);

  const schema = pool.pooledCurrencies.reduce((acc, pooled) => {
    const zeroAssetAmount = newMonetaryAmount(0, pooled.currency);
    const schemaParams: PoolDepositSchemaParams = {
      governanceBalance,
      maxAmount: getAvailableBalance(pooled.currency.ticker) || zeroAssetAmount,
      minAmount: newMonetaryAmount(1, pooled.currency),
      transactionFee: TRANSACTION_FEE_AMOUNT
    };

    return { ...acc, [pooled.currency.ticker]: validate.amm.pool.deposit(t, schemaParams) };
  }, {});

  const {
    handleSubmit: h,
    watch,
    setValue,
    control,
    formState: { errors, isDirty, isValid }
  } = useForm<DepositFormData>({
    mode: 'onChange',
    resolver: zodResolver(z.object(schema))
  });

  const data = watch();

  const isBtnDisabled = !isValidForm(errors) || !isDirty || !isValid;

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    // const otherCurrencies = pool.pooledCurrencies.filter((currency) => currency.currency.ticker !== e.target.name);

    const inputCurrency = pool.pooledCurrencies.find((currency) => currency.currency.ticker === e.target.name);

    const inputAmount = newMonetaryAmount(e.target.value || 0, inputCurrency?.currency as CurrencyExt, true);
    const amounts = pool.getLiquidityDepositInputAmounts(inputAmount);

    amounts.map((amount) =>
      setValue(amount.currency.ticker, amount.toBig().toNumber(), {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      })
    );
  };

  const handleSubmit = (data: DepositFormData) => {
    try {
      const amounts = pool.pooledCurrencies.map((currency) =>
        newMonetaryAmount(data[currency.currency.ticker], currency.currency)
      );

      return depositMutation.mutate({ amounts, pool });
    } catch (err: any) {
      toast.error(err.toString());
    }
  };

  const poolName = (
    <PoolName justifyContent='center' tickers={pool.pooledCurrencies.map((currency) => currency.currency.ticker)} />
  );

  const lpTokensAmount = pool.getLiquidityDepositLpTokenAmount(pool.pooledCurrencies[0]);

  return (
    <form onSubmit={h(handleSubmit)}>
      {poolName}
      <Flex direction='column' gap='spacing8'>
        <Flex direction='column' gap='spacing2'>
          {pool.pooledCurrencies.map((currency, index) => (
            <Flex key={currency.currency.ticker} direction='column' gap='spacing8'>
              <Controller
                render={({ field: { onChange, value, ...rest } }) => (
                  <TokenInput
                    placeholder='0.00'
                    ticker={currency.currency.ticker}
                    aria-label={t('forms.field_amount', {
                      field: `${currency.currency.ticker} ${t('deposit').toLowerCase()}`
                    })}
                    balance={getAvailableBalance(currency.currency.ticker)?.toBig().toNumber() || 0}
                    balanceDecimals={currency.currency.humanDecimals}
                    valueUSD={new Big(data[currency.currency.ticker] || 0)
                      .mul(getTokenPrice(prices, currency.currency.ticker)?.usd || 0)
                      .toNumber()}
                    errorMessage={getErrorMessage(errors[currency.currency.ticker])}
                    onChange={chain(onChange, handleChange)}
                    value={value || undefined}
                    {...rest}
                  />
                )}
                name={currency.currency.ticker}
                control={control}
              />
              {index !== pool.pooledCurrencies.length - 1 && <DepositDivider />}
            </Flex>
          ))}
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
                {formatNumber(lpTokensAmount.toBig().toNumber(), {
                  maximumFractionDigits: lpTokensAmount.currency.humanDecimals
                })}{' '}
                ($0.00)
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

        <AuthCTA type='submit' size='large' disabled={isBtnDisabled}>
          {t('amm.pools.add_liquidity')}
        </AuthCTA>
      </Flex>
    </form>
  );
};

DepositForm.displayName = 'DepositForm';

export { DepositForm };
export type { DepositFormProps };
