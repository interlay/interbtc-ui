import { useTranslation } from 'react-i18next';

import { Stack } from '@/component-library';
import FullLoadingSpinner from '@/components/FullLoadingSpinner';
import MainContainer from '@/parts/MainContainer';
import { useGetLoansData } from '@/utils/hooks/api/loans/use-get-loans-data';

import { LoansInsights, LoansTables } from './components';
import { StyledTitle } from './LoansOverview.style';

const LoansOverview = (): JSX.Element => {
  const { t } = useTranslation();
  const { overview, lendPositions, borrowPositions, assets } = useGetLoansData();
  const {
    interestEarnedUSDValue,
    borrowUSDValue: borrowBalance,
    supplyUSDValue: supplyBalance,
    earnedRewardsAmount,
    hasEarnedRewards
  } = overview;

  if (lendPositions === undefined || borrowPositions === undefined || assets === undefined) {
    return <FullLoadingSpinner />;
  }

  const handleClaimRewards = () => console.log('claiming rewards');

  return (
    <MainContainer>
      <StyledTitle>{t('loans.brand_name')}</StyledTitle>
      <Stack spacing='double'>
        <LoansInsights
          apyEarned={interestEarnedUSDValue}
          borrow={borrowBalance}
          supply={supplyBalance}
          rewards={earnedRewardsAmount}
          hasEarnedRewards={hasEarnedRewards}
          onClaimRewards={handleClaimRewards}
        />
        <LoansTables borrowPositions={borrowPositions} lendPositions={lendPositions} assets={assets} />
      </Stack>
    </MainContainer>
  );
};

export default LoansOverview;
