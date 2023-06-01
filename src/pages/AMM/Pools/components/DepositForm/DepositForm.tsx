import { CurrencyExt, LiquidityPool, newMonetaryAmount } from '@interlay/interbtc-api';
import { mergeProps } from '@react-aria/utils';
import Big from 'big.js';
import { ChangeEventHandler, RefObject, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { displayMonetaryAmountInUSDFormat, newSafeMonetaryAmount } from '@/common/utils/utils';
import { Alert, Dd, DlGroup, Dt, Flex, TokenInput } from '@/component-library';
import { AuthCTA } from '@/components';
import { GOVERNANCE_TOKEN, TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import {
  DepositLiquidityPoolFormData,
  depositLiquidityPoolSchema,
  DepositLiquidityPoolValidationParams,
  isFormDisabled,
  useForm
} from '@/lib/form';
import { SlippageManager } from '@/pages/AMM/shared/components';
import { AMM_DEADLINE_INTERVAL } from '@/utils/constants/api';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { Transaction, useTransaction } from '@/utils/hooks/transaction';
import useAccountId from '@/utils/hooks/use-account-id';

import { PoolName } from '../PoolName';
import { DepositDivider } from './DepositDivider';
import { StyledDl } from './DepositForm.styles';
import { DepositOutputAssets } from './DepositOutputAssets';

const isCustomAmountsMode = (form: ReturnType<typeof useForm>) =>
  form.dirty && Object.values(form.touched).filter(Boolean).length > 0;

type DepositFormProps = {
  pool: LiquidityPool;
  slippageModalRef: RefObject<HTMLDivElement>;
  onSuccess?: () => void;
  onSigning?: () => void;
};

const DepositForm = ({ pool, slippageModalRef, onSuccess, onSigning }: DepositFormProps): JSX.Element => {
  const { pooledCurrencies } = pool;
  const defaultValues = pooledCurrencies.reduce((acc, amount) => ({ ...acc, [amount.currency.ticker]: '' }), {});

  const [slippage, setSlippage] = useState(0.1);

  const accountId = useAccountId();
  const { t } = useTranslation();
  const { getAvailableBalance, getBalance } = useGetBalances();
  const prices = useGetPrices();

  const governanceBalance = getBalance(GOVERNANCE_TOKEN.ticker)?.free || newMonetaryAmount(0, GOVERNANCE_TOKEN);

  const transaction = useTransaction(Transaction.AMM_ADD_LIQUIDITY, {
    onSuccess,
    onSigning
  });

  const handleSubmit = async (data: DepositLiquidityPoolFormData) => {
    if (!accountId) return;

    try {
      const amounts = pooledCurrencies.map((amount) =>
        newSafeMonetaryAmount(data[amount.currency.ticker] || 0, amount.currency, true)
      );

      const deadline = await window.bridge.system.getFutureBlockNumber(AMM_DEADLINE_INTERVAL);

      return transaction.execute(amounts, pool, slippage, deadline, accountId);
    } catch (error: any) {
      transaction.reject(error);
    }
  };

  const tokens = pooledCurrencies.reduce(
    (acc: DepositLiquidityPoolValidationParams['tokens'], pooled) => ({
      ...acc,
      [pooled.currency.ticker]: {
        minAmount: newMonetaryAmount(1, pooled.currency),
        maxAmount: getAvailableBalance(pooled.currency.ticker) || newMonetaryAmount(0, pooled.currency)
      }
    }),
    {}
  );

  const form = useForm<DepositLiquidityPoolFormData>({
    initialValues: defaultValues,
    validationSchema: depositLiquidityPoolSchema({ transactionFee: TRANSACTION_FEE_AMOUNT, governanceBalance, tokens }),
    onSubmit: handleSubmit
  });

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (isCustomAmountsMode(form)) return;

    if (!e.target.value || isNaN(Number(e.target.value))) {
      return form.setValues(defaultValues);
    }

    // If pool has no liquidity, the assets ratio is set by the user,
    // therefore the value inputted is directly used.
    if (pool.isEmpty) {
      return form.setValues({ [e.target.name]: e.target.value });
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

    form.setValues(newValues);
  };

  const poolName = (
    <PoolName justifyContent='center' tickers={pooledCurrencies.map((amount) => amount.currency.ticker)} />
  );

  const isBtnDisabled = isFormDisabled(form);

  return (
    <form onSubmit={form.handleSubmit}>
      <Flex direction='column'>
        <SlippageManager ref={slippageModalRef} value={slippage} onChange={(slippage) => setSlippage(slippage)} />
        {poolName}
        <Flex direction='column' gap='spacing8'>
          <Flex direction='column' gap='spacing2'>
            {pooledCurrencies.map((amount, index) => {
              const {
                currency: { ticker }
              } = amount;

              const isLastItem = index === pooledCurrencies.length - 1;

              const balance = getAvailableBalance(ticker);

              return (
                <Flex key={ticker} direction='column' gap='spacing8'>
                  <TokenInput
                    placeholder='0.00'
                    ticker={ticker}
                    aria-label={t('forms.field_amount', {
                      field: `${ticker} ${t('deposit').toLowerCase()}`
                    })}
                    balance={balance?.toString() || 0}
                    humanBalance={balance?.toHuman() || 0}
                    valueUSD={new Big(isNaN(Number(form.values[ticker])) ? 0 : form.values[ticker] || 0)
                      .mul(getTokenPrice(prices, ticker)?.usd || 0)
                      .toNumber()}
                    {...mergeProps(form.getFieldProps(ticker), { onChange: handleChange })}
                  />
                  {!isLastItem && <DepositDivider />}
                </Flex>
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

          <StyledDl direction='column' gap='spacing2'>
            <DlGroup justifyContent='space-between'>
              <Dt size='xs' color='primary'>
                {t('fees')}
              </Dt>
              <Dd size='xs'>
                {TRANSACTION_FEE_AMOUNT.toHuman()} {TRANSACTION_FEE_AMOUNT.currency.ticker} (
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
      </Flex>
    </form>
  );
};

DepositForm.displayName = 'DepositForm';

export { DepositForm };
export type { DepositFormProps };
