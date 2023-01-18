import { zodResolver } from '@hookform/resolvers/zod';
import { LiquidityPool, newMonetaryAmount } from '@interlay/interbtc-api';
import Big from 'big.js';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as z from 'zod';

import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { CTA, Dd, Dl, DlGroup, Dt, Flex, P, TokenInput } from '@/component-library';
import { GOVERNANCE_TOKEN, TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import validate, { PoolDepositSchemaParams } from '@/lib/form-validation';
import { getErrorMessage, isValidForm } from '@/utils/helpers/forms';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { PoolName } from '../PoolName';
import { StyledDl } from './DepositForm.styles';

type DepositFormData = Record<string, string>;

type DepositFormProps = {
  pool: LiquidityPool;
  onChangePool?: () => void;
};

const DepositForm = ({ pool }: DepositFormProps): JSX.Element => {
  const { t } = useTranslation();
  const { getBalance, getAvailableBalance } = useGetBalances();
  const prices = useGetPrices();

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
    register,
    handleSubmit: h,
    watch,
    formState: { errors, isDirty, isValid }
  } = useForm<DepositFormData>({
    mode: 'onChange',
    resolver: zodResolver(z.object(schema))
  });

  const data = watch();
  console.log(data);
  // const monetaryAmount = newMonetaryAmount(amount, asset.currency, true);

  const isBtnDisabled = !isValidForm(errors) || !isDirty || !isValid;

  const handleSubmit = (data: DepositFormData) => {
    try {
      console.log(data);
    } catch (err: any) {
      toast.error(err.toString());
    }
  };

  const poolName = (
    <PoolName justifyContent='center' tickers={pool.pooledCurrencies.map((currency) => currency.currency.ticker)} />
  );

  return (
    <form onSubmit={h(handleSubmit)}>
      {poolName}
      <Flex direction='column' gap='spacing8'>
        <Flex direction='column' gap='spacing2'>
          {pool.pooledCurrencies.map((currency) => (
            <TokenInput
              key={currency.currency.ticker}
              placeholder='0.00'
              ticker={currency.currency.ticker}
              aria-label={t('forms.field_amount', {
                field: `${currency.currency.ticker} ${t('deposit').toLowerCase()}}`
              })}
              balance={getAvailableBalance(currency.currency.ticker)?.toBig().toNumber() || 0}
              balanceDecimals={currency.currency.humanDecimals}
              valueUSD={new Big(data[currency.currency.ticker] || 0)
                .mul(getTokenPrice(prices, currency.currency.ticker)?.usd || 0)
                .toNumber()}
              errorMessage={getErrorMessage(errors[currency.currency.ticker])}
              {...register(currency.currency.ticker)}
            />
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
              <Dd size='xs'>62.00 ($22.00)</Dd>
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

        <CTA type='submit' size='large' disabled={isBtnDisabled}>
          {t('amm.pools.add_liquidity')}
        </CTA>
      </Flex>
    </form>
  );
};

DepositForm.displayName = 'DepositForm';

export { DepositForm };
export type { DepositFormProps };
