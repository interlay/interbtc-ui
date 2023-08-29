import { Flex } from '@/component-library';
import { MainContainer } from '@/components';
import { useGetAccountStakingClaimableRewards } from '@/hooks/api/escrow/use-get-account-claimable-rewards';
import { useGetAccountStakingData } from '@/hooks/api/escrow/use-get-account-staking-data';
import { useGetNetworkStakingData } from '@/hooks/api/escrow/uset-get-network-staking-data';
import FullLoadingSpinner from '@/legacy-components/FullLoadingSpinner';

import { StakingAccountDetails } from './components';
import { StakingWithdrawCard } from './components/StakingWithdrawCard';
import { StyledStakingForm, StyledWrapper } from './Staking.style';

const Staking = (): JSX.Element => {
  const { data: accountData, refetch: refetchAccountData } = useGetAccountStakingData();
  const { data: claimableRewards, refetch: refetchClaimableRewards } = useGetAccountStakingClaimableRewards();
  const { data: networkData } = useGetNetworkStakingData();

  if (accountData === undefined || claimableRewards === undefined || networkData === undefined) {
    return <FullLoadingSpinner />;
  }

  return (
    <MainContainer>
      <StyledWrapper gap='spacing4'>
        <StyledStakingForm accountData={accountData} networkData={networkData} onStaking={refetchAccountData} />
        <Flex direction='column' gap='spacing4'>
          <StakingAccountDetails
            accountData={accountData}
            claimableRewards={claimableRewards}
            onClaimRewards={refetchClaimableRewards}
          />
          {accountData && <StakingWithdrawCard data={accountData} onWithdraw={refetchAccountData} />}
        </Flex>
      </StyledWrapper>
    </MainContainer>
  );
};

export default Staking;
