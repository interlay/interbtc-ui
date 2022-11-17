import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';

import { Card, CTA, Dl, DlGroup } from '@/component-library';
import ErrorModal from '@/components/ErrorModal';

import { StyledDd, StyledDt } from './LoansInsights.style';

const mutateClaimRewards = () => window.bridge.loans.claimAllSubsidyRewards();

type LoansInsightsProps = {
  supply: string | undefined;
  borrow: string | undefined;
  netYield: string | undefined;
  rewards: string | undefined;
  hasEarnedRewards: boolean;
};

const LoansInsights = ({
  supply,
  netYield,
  borrow,
  rewards,
  hasEarnedRewards: hasEarnedRewardsProp
}: LoansInsightsProps): JSX.Element => {
  const [hasEarnedRewards, setEarnedRewards] = useState(hasEarnedRewardsProp);

  const claimRewardsMutation = useMutation<void, Error, void>(mutateClaimRewards, {
    onSuccess: () => setEarnedRewards(false)
  });

  useEffect(() => {
    setEarnedRewards(hasEarnedRewardsProp);
  }, [hasEarnedRewardsProp]);

  const handleClickClaimRewards = () => claimRewardsMutation.mutate();

  return (
    <>
      <Dl wrap direction='row'>
        <Card flex='1'>
          <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
            <StyledDt color='primary'>Supply Balance</StyledDt>
            <StyledDd color='secondary'>{supply}</StyledDd>
          </DlGroup>
        </Card>
        <Card flex='1'>
          <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
            <StyledDt color='primary'>Borrow Balance</StyledDt>
            <StyledDd color='secondary'>{borrow}</StyledDd>
          </DlGroup>
        </Card>
        <Card flex='1'>
          <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
            <StyledDt color='primary'>Net Yield</StyledDt>
            <StyledDd color='secondary'>{netYield}</StyledDd>
          </DlGroup>
        </Card>
        <Card
          direction='row'
          flex={hasEarnedRewards ? '1.5' : '1'}
          gap='spacing2'
          alignItems='center'
          justifyContent='space-between'
        >
          <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
            <StyledDt color='primary'>Rewards</StyledDt>
            <StyledDd color='secondary'>{rewards}</StyledDd>
          </DlGroup>
          {hasEarnedRewards && (
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
