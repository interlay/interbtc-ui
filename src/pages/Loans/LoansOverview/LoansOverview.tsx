import { Flex } from '@/component-library';
import FullLoadingSpinner from '@/components/FullLoadingSpinner';
import MainContainer from '@/parts/MainContainer';
import { useGetLoansData } from '@/utils/hooks/api/loans/use-get-loans-data';

import { LoansInsights, LoansTables } from './components';

const LoansOverview = (): JSX.Element => {
  const { overview, lendPositions, borrowPositions, assets } = useGetLoansData();
  const {
    netYieldUSDValue,
    borrowUSDValue: borrowBalance,
    supplyUSDValue: supplyBalance,
    earnedRewardsAmount,
    hasEarnedRewards
  } = overview;

  if (lendPositions === undefined || borrowPositions === undefined || assets === undefined) {
    return <FullLoadingSpinner />;
  }

  return (
    <MainContainer>
      <Flex direction='column' gap='spacing12'>
        <LoansInsights
          netYield={netYieldUSDValue}
          borrow={borrowBalance}
          supply={supplyBalance}
          rewards={earnedRewardsAmount}
          hasEarnedRewards={hasEarnedRewards}
        />
        <LoansTables borrowPositions={borrowPositions} lendPositions={lendPositions} assets={assets} />
      </Flex>
    </MainContainer>
  );
};

export default LoansOverview;
