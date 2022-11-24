import { Flex } from '@/component-library';
import FullLoadingSpinner from '@/components/FullLoadingSpinner';
import MainContainer from '@/parts/MainContainer';
import { useGetAccountPositions } from '@/utils/hooks/api/loans/use-get-account-positions';
import { useGetLoanAssets } from '@/utils/hooks/api/loans/use-get-loan-assets';

import { LoansInsights, LoansTables } from './components';

const LoansOverview = (): JSX.Element => {
  const { data: assets } = useGetLoanAssets();
  const {
    data: { borrowPositions, lendPositions, statistics }
  } = useGetAccountPositions();

  if (lendPositions === undefined || borrowPositions === undefined || assets === undefined) {
    return <FullLoadingSpinner />;
  }

  return (
    <MainContainer>
      <Flex direction='column' gap='spacing12'>
        <LoansInsights statistics={statistics} />
        <LoansTables borrowPositions={borrowPositions} lendPositions={lendPositions} assets={assets} />
      </Flex>
    </MainContainer>
  );
};

export default LoansOverview;
