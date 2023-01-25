import { CurrencyExt, LiquidityPool, newMonetaryAmount, PooledCurrencies } from '@interlay/interbtc-api';
import { AccountId } from '@polkadot/types/interfaces';
import Big from 'big.js';
import { ChangeEventHandler, FormEventHandler, Key, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { Dd, DlGroup, Dt, Flex, TokenInput } from '@/component-library';
import { AuthCTA } from '@/components/AuthCTA';
import { TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import { SlippageManager } from '@/pages/AMM/shared/components';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { PoolName } from '../PoolName';
import { DepositDivider } from './DepositDivider';
import { StyledDl } from './DepositForm.styles';
import { DepositOutputAssets } from './DepositOutputAssets';
import { useFormState } from './use-form-state';

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
          <DepositOutputAssets pool={pool} values={values} prices={prices} />
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
