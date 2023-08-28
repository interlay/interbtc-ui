import { Flex } from '@/component-library';
import { MainContainer } from '@/components';
import { useGetAccountStakingData } from '@/hooks/api/escrow/use-get-account-staking-data';
import { useGetNetworkStakingData } from '@/hooks/api/escrow/uset-get-network-staking-data';
import FullLoadingSpinner from '@/legacy-components/FullLoadingSpinner';

import { StakingAccountDetails } from './components';
import { StakingWithdrawCard } from './components/StakingWithdrawCard';
import { StyledStakingForm, StyledWrapper } from './Staking.style';

const Staking = (): JSX.Element => {
  const { data: accountData, refetch: refetchAccountData } = useGetAccountStakingData();
  const { data: networkData } = useGetNetworkStakingData();

  if (accountData === undefined || networkData === undefined) {
    return <FullLoadingSpinner />;
  }

  return (
    <MainContainer>
      <StyledWrapper gap='spacing8'>
        <StyledStakingForm accountData={accountData} networkData={networkData} onStaking={refetchAccountData} />
        <Flex direction='column' gap='spacing4'>
          <StakingAccountDetails data={accountData} onVotingClaimRewards={refetchAccountData} />
          {accountData && <StakingWithdrawCard data={accountData} onClaimRewards={refetchAccountData} />}
        </Flex>
      </StyledWrapper>
    </MainContainer>
  );
};

export default Staking;
