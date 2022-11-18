import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';

import { Card, CTA, Dl, DlGroup } from '@/component-library';
import ErrorModal from '@/components/ErrorModal';
import { useGetAccountLoansOverview } from '@/utils/hooks/api/loans/use-get-account-loans-overview';

import { StyledDd, StyledDt } from './LoansInsights.style';

const mutateClaimRewards = () => window.bridge.loans.claimAllSubsidyRewards();

type LoansInsightsProps = {
  supply: string | undefined;
  borrow: string | undefined;
  netYield: string | undefined;
  rewards: string | undefined;
  hasSubsidyRewards: boolean;
};

const LoansInsights = ({
  supply,
  netYield,
  borrow,
  rewards,
  hasSubsidyRewards: hasSubsidyRewardsProp
}: LoansInsightsProps): JSX.Element => {
  const [hasSubsidyRewards, setSubsidyRewards] = useState(hasSubsidyRewardsProp);

  const { refetch } = useGetAccountLoansOverview();

  const handleSuccess = () => {
    setSubsidyRewards(false);
    refetch();
  };

  const claimRewardsMutation = useMutation<void, Error, void>(mutateClaimRewards, {
    onSuccess: handleSuccess
  });

  useEffect(() => {
    setSubsidyRewards(hasSubsidyRewards);
  }, [hasSubsidyRewards]);

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
          flex={hasSubsidyRewards ? '1.5' : '1'}
          gap='spacing2'
          alignItems='center'
          justifyContent='space-between'
        >
          <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
            <StyledDt color='primary'>Rewards</StyledDt>
            <StyledDd color='secondary'>{rewards}</StyledDd>
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
