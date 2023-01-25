import { LiquidityPool, LpCurrency, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';
import Big from 'big.js';
import { Key, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import {
  convertMonetaryAmountToValueInUSD,
  displayMonetaryAmount,
  displayMonetaryAmountInUSDFormat,
  formatNumber
} from '@/common/utils/utils';
import { CoinIcon, Dd, Dl, DlGroup, Dt, Flex, P, TokenInput } from '@/component-library';
import { AuthCTA } from '@/components/AuthCTA';
import { TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import { SlippageManager } from '@/pages/AMM/shared/components';
import { getErrorMessage, isValidForm } from '@/utils/helpers/forms';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { PoolName } from '../PoolName';
import { StyledDl } from './WithdrawForm.styles';

type DepositData = {
  amount: MonetaryAmount<LpCurrency>;
  pool: LiquidityPool;
  slippage: number;
  deadline: number;
  accountId: AccountId;
};

const mutateWithdraw = ({ amount, pool, slippage, deadline, accountId }: DepositData) =>
  window.bridge.amm.removeLiquidity(amount, pool, slippage, deadline, accountId);

enum FormFields {
  WITHDRAW_AMOUNT = 'withdraw-amount'
}

type WithdrawFormData = {
  [FormFields.WITHDRAW_AMOUNT]: string;
};

type WithdrawFormProps = {
  pool: LiquidityPool;
  accountId: AccountId;
  onWithdraw?: () => void;
};

const WithdrawForm = ({ pool, onWithdraw }: WithdrawFormProps): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();
  const { getAvailableBalance } = useGetBalances();
  const [slippage, setSlippage] = useState<Key>('0.1');

  const { lpToken } = pool;

  const {
    register,
    handleSubmit: h,
    formState: { errors, isDirty, isValid },
    watch
  } = useForm<WithdrawFormData>({
    mode: 'onChange'
    // TODO: when there is more info regarding LP Tokens, I will add validation
    // resolver: zodResolver(z.object({[FormFields.WITHDRAW_AMOUNT]: validate.amm.pool.withdraw()}))
  });

  const withdrawMutation = useMutation<void, Error, DepositData>(mutateWithdraw, {
    onSuccess: () => {
      onWithdraw?.();
      toast.success('Withdraw successful');
    }
  });

  const data = watch();

  const isBtnDisabled = !isValidForm(errors) || !isDirty || !isValid;

  const handleSubmit = (data: WithdrawFormData) => {
    try {
      console.log(withdrawMutation, data);
    } catch (err: any) {
      toast.error(err.toString());
    }
  };

  const tickers = pool.pooledCurrencies.map((currency) => currency.currency.ticker);

  const poolName = <PoolName justifyContent='center' tickers={tickers} />;

  const lpTokenAmount = newMonetaryAmount(data[FormFields.WITHDRAW_AMOUNT] || 0, pool.lpToken);

  const pooledAmounts = pool.getLiquidityWithdrawalPooledCurrencyAmounts(lpTokenAmount as any);

  return (
    <form onSubmit={h(handleSubmit)}>
      <Flex direction='column'>
        <SlippageManager value={slippage} onChange={(slippage) => setSlippage(slippage)} />
        {poolName}
        <Flex direction='column' gap='spacing8'>
          <Flex direction='column'>
            <TokenInput
              placeholder='0.00'
              ticker={{ icons: tickers, text: 'LP Token' }}
              aria-label={t('forms.field_amount', {
                field: t('withdraw').toLowerCase()
              })}
              balance={getAvailableBalance(lpToken.ticker)?.toBig().toNumber() || 0}
              balanceDecimals={lpToken.humanDecimals}
              valueUSD={new Big(data[FormFields.WITHDRAW_AMOUNT] || 0)
                .mul(getTokenPrice(prices, lpToken.ticker)?.usd || 0)
                .toNumber()}
              errorMessage={getErrorMessage(errors[FormFields.WITHDRAW_AMOUNT])}
              {...register(FormFields.WITHDRAW_AMOUNT)}
            />
          </Flex>
          <Flex direction='column' gap='spacing4'>
            <P align='center' size='xs'>
              {t('amm.pools.receivable_assets')}
            </P>
            <Dl direction='column' gap='spacing2'>
              {pooledAmounts.map((amount) => {
                return (
                  <DlGroup key={amount.currency.ticker} justifyContent='space-between'>
                    <Dt size='xs' color='primary'>
                      <Flex alignItems='center' gap='spacing1'>
                        <CoinIcon ticker={amount.currency.ticker} />
                        {amount.currency.ticker}
                      </Flex>
                    </Dt>
                    <Dd size='xs'>
                      {formatNumber(amount.toBig().toNumber(), {
                        maximumFractionDigits: amount.currency.humanDecimals
                      })}{' '}
                      ({convertMonetaryAmountToValueInUSD(amount, getTokenPrice(prices, amount.currency.ticker)?.usd)})
                    </Dd>
                  </DlGroup>
                );
              })}
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
