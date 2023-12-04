import { LiquidityPool } from '@interlay/interbtc-api';
import Big from 'big.js';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { formatUSD } from '@/common/utils/utils';
import { Card, Dl, DlGroup } from '@/component-library';
import { AccountPoolsData } from '@/hooks/api/amm/use-get-account-pools';
import { useGetPrices } from '@/hooks/api/use-get-prices';
import { Transaction, useTransaction } from '@/hooks/transaction';
import {
  ClaimRewardsPoolFormData,
  claimRewardsPoolSchema,
  POOL_CLAIM_REWARDS_FEE_TOKEN_FIELD,
  useForm
} from '@/lib/form';
import { calculateAccountLiquidityUSD, calculateTotalLiquidityUSD } from '@/utils/helpers/pool';

import { StyledDd, StyledDt } from './PoolsInsights.style';

type PoolsInsightsProps = {
  pools: LiquidityPool[];
  accountPoolsData?: AccountPoolsData;
  refetch: () => void;
};

const PoolsInsights = ({ pools, accountPoolsData, refetch }: PoolsInsightsProps): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();
  const [isOpen, setOpen] = useState(false);

  const transaction = useTransaction(Transaction.AMM_CLAIM_REWARDS, {
    onSuccess: refetch,
    onSigning: () => setOpen(false)
  });

  const handleSubmit = () => {
    if (!accountPoolsData) return;

    transaction.execute(accountPoolsData.claimableRewards);
  };

  const form = useForm<ClaimRewardsPoolFormData>({
    initialValues: {
      [POOL_CLAIM_REWARDS_FEE_TOKEN_FIELD]: ''
    },
    validationSchema: claimRewardsPoolSchema(),
    onSubmit: handleSubmit,
    onComplete: async () => {
      if (!accountPoolsData) return;

      return transaction.fee.estimate(accountPoolsData.claimableRewards);
    }
  });

  // Doing this call on mount so that the form becomes dirty
  useEffect(() => {
    if (!isOpen) return;

    form.setFieldValue(POOL_CLAIM_REWARDS_FEE_TOKEN_FIELD, transaction.fee.defaultCurrency.ticker, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const accountPositions = accountPoolsData?.positions;

  const supplyAmountUSD = accountPositions?.reduce((acc, curr) => {
    const totalLiquidityUSD = calculateTotalLiquidityUSD(curr.data.pooledCurrencies, prices);

    const accountLiquidityUSD =
      curr.amount && !curr.data.isEmpty
        ? calculateAccountLiquidityUSD(curr.amount, totalLiquidityUSD, curr.data.totalSupply)
        : 0;

    return acc.add(accountLiquidityUSD);
  }, new Big(0));

  const supplyBalanceLabel = supplyAmountUSD ? formatUSD(supplyAmountUSD.toNumber() || 0, { compact: true }) : '-';

  const totalLiquidity = pools.reduce((acc, pool) => {
    const poolLiquidityUSD = calculateTotalLiquidityUSD(pool.pooledCurrencies, prices);

    return acc.add(poolLiquidityUSD);
  }, new Big(0));

  const totalLiquidityUSD = formatUSD(totalLiquidity?.toNumber() || 0, { compact: true });

  return (
    <Dl wrap direction='row'>
      <Card flex='1'>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
          <StyledDt color='primary'>{t('supply_balance')}</StyledDt>
          <StyledDd color='secondary'>{supplyBalanceLabel}</StyledDd>
        </DlGroup>
      </Card>
      <Card flex='1'>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
          <StyledDt color='primary'>{t('total_liquidity')}</StyledDt>
          <StyledDd color='secondary'>{totalLiquidityUSD}</StyledDd>
        </DlGroup>
      </Card>
    </Dl>
  );
};

export { PoolsInsights };
export type { PoolsInsightsProps };
