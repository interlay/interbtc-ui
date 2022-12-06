import { Flex } from '@/component-library';
import FullLoadingSpinner from '@/components/FullLoadingSpinner';
import MainContainer from '@/parts/MainContainer';
import { useGetAccountPositions } from '@/utils/hooks/api/loans/use-get-account-positions';
import { useGetLoanAssets } from '@/utils/hooks/api/loans/use-get-loan-assets';
import useAccountId from '@/utils/hooks/use-account-id';

import { LoansInsights, LoansTables, LTVSection } from './components';

const LoansOverview = (): JSX.Element => {
  const accountId = useAccountId();
  const { data: assets } = useGetLoanAssets();
  const {
    data: { borrowPositions, lendPositions, hasCollateral, statistics }
  } = useGetAccountPositions();

  const isLoadingPositions = accountId !== undefined && (lendPositions === undefined || borrowPositions === undefined);

  if (assets === undefined || isLoadingPositions) {
    return <FullLoadingSpinner />;
  }

  return (
    <MainContainer>
      <Flex direction='column' gap='spacing8'>
        <Flex direction='column' gap='spacing4'>
          <LoansInsights statistics={statistics} />
          {hasCollateral && <LTVSection statistics={statistics} />}
        </Flex>
        <LoansTables borrowPositions={borrowPositions || []} lendPositions={lendPositions || []} assets={assets} />
      </Flex>
    </MainContainer>
  );
};

export default LoansOverview;
