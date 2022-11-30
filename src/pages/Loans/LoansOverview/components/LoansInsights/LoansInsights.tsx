import { useMutation } from 'react-query';

import { formatNumber, formatUSD } from '@/common/utils/utils';
import { Card, CTA, Dl, DlGroup } from '@/component-library';
import ErrorModal from '@/components/ErrorModal';
import { AccountPositionsStatisticsData } from '@/utils/hooks/api/loans/use-get-account-positions';
import { useGetAccountSubsidyRewards } from '@/utils/hooks/api/loans/use-get-account-subsidy-rewards';

import { StyledDd, StyledDt } from './LoansInsights.style';

const mutateClaimRewards = () => window.bridge.loans.claimAllSubsidyRewards();

type LoansInsightsProps = {
  statistics?: AccountPositionsStatisticsData;
};

const LoansInsights = ({ statistics }: LoansInsightsProps): JSX.Element => {
  const { data: subsidyRewards, refetch } = useGetAccountSubsidyRewards();

  const handleSuccess = () => {
    refetch();
  };

  const claimRewardsMutation = useMutation<void, Error, void>(mutateClaimRewards, {
    onSuccess: handleSuccess
  });

  const handleClickClaimRewards = () => claimRewardsMutation.mutate();

  const { supplyAmountUSD, netYieldAmountUSD } = statistics || {};

  const supplyBalanceLabel = formatUSD(supplyAmountUSD?.toNumber() || 0);
  const netYieldBalanceLabel = formatUSD(netYieldAmountUSD?.toNumber() || 0);

  const subsidyRewardsAmount = formatNumber(subsidyRewards?.toBig().toNumber() || 0, {
    maximumFractionDigits: subsidyRewards?.currency.humanDecimals || 5
  });
  const subsidyRewardsAmountLabel = `${subsidyRewardsAmount} ${subsidyRewards?.currency.ticker || ''}`;
  const hasSubsidyRewards = !!subsidyRewards && !subsidyRewards?.isZero();

  return (
    <>
      <Dl wrap direction='row'>
        <Card flex='1'>
          <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
            <StyledDt color='primary'>Supply Balance</StyledDt>
            <StyledDd color='secondary'>{supplyBalanceLabel}</StyledDd>
          </DlGroup>
        </Card>
        <Card flex='1'>
          <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
            <StyledDt color='primary'>Net APY</StyledDt>
            <StyledDd color='secondary'>{netYieldBalanceLabel}</StyledDd>
          </DlGroup>
        </Card>
        <Card
          direction='row'
          flex={hasSubsidyRewards ? '1.5' : '1'}
          gap='spacing2'
          alignItems='center'
          justifyContent='space-between'
        >
          <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
            <StyledDt color='primary'>Rewards</StyledDt>
            <StyledDd color='secondary'>{subsidyRewardsAmountLabel}</StyledDd>
          </DlGroup>
          {hasSubsidyRewards && (
            <CTA onClick={handleClickClaimRewards} loading={claimRewardsMutation.isLoading}>
              Claim
            </CTA>
          )}
        </Card>
      </Dl>
      {claimRewardsMutation.isError && (
        <ErrorModal
          open={claimRewardsMutation.isError}
          onClose={() => claimRewardsMutation.reset()}
          title='Error'
          description={claimRewardsMutation.error?.message || ''}
        />
      )}
    </>
  );
};

export { LoansInsights };
export type { LoansInsightsProps };
