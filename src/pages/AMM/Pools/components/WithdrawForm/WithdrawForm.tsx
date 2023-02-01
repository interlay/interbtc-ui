import { zodResolver } from '@hookform/resolvers/zod';
import { LiquidityPool, LpCurrency, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';
import Big from 'big.js';
import { RefObject, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import * as z from 'zod';

import {
  convertMonetaryAmountToValueInUSD,
  displayMonetaryAmount,
  displayMonetaryAmountInUSDFormat
} from '@/common/utils/utils';
import { Dd, DlGroup, Dt, Flex, TokenInput } from '@/component-library';
import { GOVERNANCE_TOKEN, TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import { AuthCTA } from '@/legacy-components/AuthCTA';
import validate, { PoolWithdrawSchemaParams } from '@/lib/form-validation';
import { SlippageManager } from '@/pages/AMM/shared/components';
import { AMM_DEADLINE_INTERVAL } from '@/utils/constants/api';
import { getErrorMessage, isValidForm } from '@/utils/helpers/forms';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import useAccountId from '@/utils/hooks/use-account-id';

import { PoolName } from '../PoolName';
import { WithdrawAssets } from './WithdrawAssets';
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
  slippageModalRef: RefObject<HTMLDivElement>;
  onWithdraw?: () => void;
};

const WithdrawForm = ({ pool, slippageModalRef, onWithdraw }: WithdrawFormProps): JSX.Element => {
  const [slippage, setSlippage] = useState<number>(0.1);

  const accountId = useAccountId();
  const { t } = useTranslation();
  const prices = useGetPrices();
  const { getAvailableBalance, getBalance } = useGetBalances();

  const withdrawMutation = useMutation<void, Error, DepositData>(mutateWithdraw, {
    onSuccess: () => {
      onWithdraw?.();
      toast.success('Withdraw successful');
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  const { lpToken } = pool;

  const governanceBalance = getBalance(GOVERNANCE_TOKEN.ticker)?.free || newMonetaryAmount(0, GOVERNANCE_TOKEN);
  const balance = getAvailableBalance(lpToken.ticker);

  const zeroAssetAmount = newMonetaryAmount(0, lpToken);
  const schemaParams: PoolWithdrawSchemaParams = {
    governanceBalance,
    maxAmount: balance || zeroAssetAmount,
    minAmount: newMonetaryAmount(1, lpToken),
    transactionFee: TRANSACTION_FEE_AMOUNT
  };

  const {
    register,
    handleSubmit: h,
    formState: { errors, isDirty, isValid },
    watch
  } = useForm<WithdrawFormData>({
    mode: 'onChange',
    resolver: zodResolver(z.object({ [FormFields.WITHDRAW_AMOUNT]: validate.amm.pool.withdraw(t, schemaParams) }))
  });

  const handleSubmit = async (data: WithdrawFormData) => {
    if (!accountId) return;

    try {
      const amount = newMonetaryAmount(data[FormFields.WITHDRAW_AMOUNT] || 0, lpToken, true);
      const deadline = await window.bridge.system.getFutureBlockNumber(AMM_DEADLINE_INTERVAL);

      return withdrawMutation.mutate({ amount, pool, deadline, slippage, accountId });
    } catch (err: any) {
      toast.error(err.toString());
    }
  };

  const data = watch();
  const lpTokenMonetaryAmount = newMonetaryAmount(data[FormFields.WITHDRAW_AMOUNT] || 0, pool.lpToken, true);

  const isBtnDisabled = !isValidForm(errors) || !isDirty || !isValid;

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
    <form onSubmit={h(handleSubmit)}>
      <Flex direction='column'>
        <SlippageManager ref={slippageModalRef} value={slippage} onChange={(slippage) => setSlippage(slippage)} />
        {poolName}
        <Flex direction='column' gap='spacing8'>
          <Flex direction='column'>
            <TokenInput
              placeholder='0.00'
              ticker={{ icons: tickers, text: 'LP Token' }}
              aria-label={t('forms.field_amount', {
                field: t('withdraw').toLowerCase()
              })}
              balance={balance?.toBig().toNumber() || 0}
              balanceDecimals={lpToken.humanDecimals}
              valueUSD={pooledAmountsUSD}
              errorMessage={getErrorMessage(errors[FormFields.WITHDRAW_AMOUNT])}
              {...register(FormFields.WITHDRAW_AMOUNT)}
            />
          </Flex>
          <WithdrawAssets pooledAmounts={pooledAmounts} prices={prices} />
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
          <AuthCTA type='submit' size='large' disabled={isBtnDisabled} loading={withdrawMutation.isLoading}>
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
