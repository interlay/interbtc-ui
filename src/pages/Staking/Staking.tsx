import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { Card, Flex, P } from '@/component-library';
import { AuthCTA, MainContainer } from '@/components';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { useGetAccountStakingData } from '@/hooks/api/escrow/use-get-account-staking-data';
import { useGetAccountVotingBalance } from '@/hooks/api/escrow/use-get-account-voting-balance';
import { useGetNetworkStakingData } from '@/hooks/api/escrow/uset-get-network-staking-data';
import FullLoadingSpinner from '@/legacy-components/FullLoadingSpinner';
import { YEAR_MONTH_DAY_PATTERN } from '@/utils/constants/date-time';

import { StakingAccountDetails } from './components';
import { StyledStakingForm, StyledWrapper } from './Staking.style';

const Staking = (): JSX.Element => {
  const { t } = useTranslation();
  const { data: accountStakingData, refetch: refetchAccountStakingData } = useGetAccountStakingData();
  const { data: votingBalance } = useGetAccountVotingBalance();
  const { data: networkStakingData } = useGetNetworkStakingData();

  if (accountStakingData === undefined || votingBalance === undefined || networkStakingData === undefined) {
    return <FullLoadingSpinner />;
  }

  return (
    <MainContainer>
      <StyledWrapper gap='spacing8'>
        <StyledStakingForm
          accountData={accountStakingData}
          networkData={networkStakingData}
          votingBalance={votingBalance}
        />
        <Flex direction='column' gap='spacing4'>
          <StakingAccountDetails
            claimableRewardsAmount={accountStakingData.claimableRewards}
            projectedRewardsAmount={accountStakingData.projected.amount}
            stakedAmount={accountStakingData.balance}
            votingBalance={votingBalance}
            onClaimRewards={refetchAccountStakingData}
          />
          <Card direction='column' gap='spacing4'>
            <P size='s'>
              Withdraw Staked {GOVERNANCE_TOKEN.ticker} on{' '}
              {format(accountStakingData.unlock.date, YEAR_MONTH_DAY_PATTERN)}
            </P>
            <AuthCTA>{t('withdraw')}</AuthCTA>
          </Card>
        </Flex>
      </StyledWrapper>
    </MainContainer>
  );
};

export default Staking;
