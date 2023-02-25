import * as React from 'react';

import { Flex } from '@/component-library';
import FullLoadingSpinner from '@/legacy-components/FullLoadingSpinner';
import MainContainer from '@/parts/MainContainer';
import { useGetAccountPositions } from '@/utils/hooks/api/loans/use-get-account-positions';
// ray test touch <<
// import { useGetLoanAssets } from '@/utils/hooks/api/loans/use-get-loan-assets';
// ray test touch >>
import useAccountId from '@/utils/hooks/use-account-id';

import {
  LoansInsights,
  // ray test touch <<
  // LoansTables,
  // ray test touch >>
  LTVSection
} from './components';

const LoansOverview = (): JSX.Element => {
  const accountId = useAccountId();
  // ray test touch <<
  // const { data: assets } = useGetLoanAssets();
  // ray test touch >>
  const {
    data: { borrowPositions, lendPositions, hasCollateral, statistics }
  } = useGetAccountPositions();

  // ray test touch <<
  React.useEffect(() => {
    (async () => {
      if (!accountId) return;

      const lendPositions = await window.bridge.loans.getLendPositionsOfAccount(accountId);

      const borrowPositions = await window.bridge.loans.getBorrowPositionsOfAccount(accountId);

      console.log('ray : ***** lendingPositions => ', lendPositions);
      console.log('ray : ***** borrowPositions => ', borrowPositions);
    })();
  }, [accountId]);
  // ray test touch >>

  const isLoadingPositions = accountId !== undefined && (lendPositions === undefined || borrowPositions === undefined);

  if (
    // ray test touch <<
    // assets === undefined ||
    // ray test touch >>
    isLoadingPositions
  ) {
    return <FullLoadingSpinner />;
  }

  return (
    <MainContainer>
      <Flex direction='column' gap='spacing8'>
        <Flex direction='column' gap='spacing4'>
          <LoansInsights statistics={statistics} />
          {hasCollateral && <LTVSection statistics={statistics} />}
        </Flex>
        {/* ray test touch << */}
        {/* <LoansTables borrowPositions={borrowPositions || []} lendPositions={lendPositions || []} assets={assets} /> */}
        {/* ray test touch >> */}
      </Flex>
    </MainContainer>
  );
};

export default LoansOverview;
