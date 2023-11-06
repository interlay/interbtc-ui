import { MainContainer } from '@/components';
import { useGetAccountStakingClaimableRewards } from '@/hooks/api/escrow/use-get-account-claimable-rewards';
import { useGetAccountStakingData } from '@/hooks/api/escrow/use-get-account-staking-data';
import { useGetNetworkStakingData } from '@/hooks/api/escrow/uset-get-network-staking-data';
import FullLoadingSpinner from '@/legacy-components/FullLoadingSpinner';

import { StakingAccountDetails } from './components';
import { StakingWithdrawCard } from './components/StakingWithdrawCard';
import { StyledStakingDetails, StyledStakingForm, StyledWrapper } from './Staking.style';

const Staking = (): JSX.Element => {
  const {
    data: accountData,
    refetch: refetchAccountData,
    isLoading: isAccountStakingDataLoading
  } = useGetAccountStakingData();
  const {
    data: claimableRewards,
    refetch: refetchClaimableRewards,
    isLoading: isClaimableRewardsLoading
  } = useGetAccountStakingClaimableRewards();
  const { data: networkData } = useGetNetworkStakingData();

  if (
    (isAccountStakingDataLoading && accountData === undefined) ||
    (isClaimableRewardsLoading && claimableRewards === undefined) ||
    networkData === undefined
  ) {
    return <FullLoadingSpinner />;
  }

  return (
    <MainContainer>
      <StyledWrapper gap='spacing4'>
        <StyledStakingForm accountData={accountData} networkData={networkData} onStaking={refetchAccountData} />
        <StyledStakingDetails direction='column' gap='spacing4'>
          <StakingAccountDetails
            accountData={accountData}
            claimableRewards={claimableRewards}
            onClaimRewards={refetchClaimableRewards}
          />
          {accountData && <StakingWithdrawCard data={accountData} onWithdraw={refetchAccountData} />}
        </StyledStakingDetails>
      </StyledWrapper>
    </MainContainer>
  );
};

export default Staking;
