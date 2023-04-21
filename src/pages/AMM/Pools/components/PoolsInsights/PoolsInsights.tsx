import { LiquidityPool } from '@interlay/interbtc-api';
import Big from 'big.js';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { formatUSD } from '@/common/utils/utils';
import { Card, CTA, Dl, DlGroup } from '@/component-library';
import { calculateAccountLiquidityUSD, calculateTotalLiquidityUSD } from '@/pages/AMM/shared/utils';
import { submitExtrinsic } from '@/utils/helpers/extrinsic';
import { AccountPoolsData } from '@/utils/hooks/api/amm/use-get-account-pools';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { StyledDd, StyledDt } from './PoolsInsights.style';
import { calculateClaimableFarmingRewardUSD } from './utils';

type PoolsInsightsProps = {
  pools: LiquidityPool[];
  accountPoolsData?: AccountPoolsData;
  refetch: () => void;
};

const PoolsInsights = ({ pools, accountPoolsData, refetch }: PoolsInsightsProps): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();

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

  const totalClaimableRewardUSD = calculateClaimableFarmingRewardUSD(accountPoolsData?.claimableRewards, prices);

  const handleSuccess = () => {
    toast.success(t('successfully_claimed_rewards'));
    refetch();
  };

  const mutateClaimRewards = async () => {
    if (accountPoolsData !== undefined) {
      await submitExtrinsic(window.bridge.amm.claimFarmingRewards(accountPoolsData.claimableRewards));
    }
  };

  const claimRewardsMutation = useMutation<void, Error, void>(mutateClaimRewards, {
    onSuccess: handleSuccess
  });

  const handleClickClaimRewards = () => claimRewardsMutation.mutate();

  const hasClaimableRewards = totalClaimableRewardUSD > 0;
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
      <Card direction='row' flex='1' gap='spacing2' alignItems='center' justifyContent='space-between'>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
          <StyledDt color='primary'>{t('rewards')}</StyledDt>
          <StyledDd color='secondary'>{formatUSD(totalClaimableRewardUSD, { compact: true })}</StyledDd>
        </DlGroup>
        {hasClaimableRewards && (
          <CTA onClick={handleClickClaimRewards} loading={claimRewardsMutation.isLoading}>
            Claim
          </CTA>
        )}
      </Card>
    </Dl>
  );
};

export { PoolsInsights };
export type { PoolsInsightsProps };
