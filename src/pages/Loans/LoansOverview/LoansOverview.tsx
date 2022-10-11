import { useTranslation } from 'react-i18next';

import { H1, P, Stack } from '@/component-library';
import MainContainer from '@/parts/MainContainer';
import { useGetLoansData } from '@/utils/hooks/api/loans/use-get-loans-data';

import { LoadingSpinner } from '../../../component-library/LoadingSpinner';
import { LoansInsights, LoansMarkets } from './components';

const LoansOverview = (): JSX.Element => {
  const { t } = useTranslation();
  const { overview, lendPositions, borrowPositions, assets } = useGetLoansData();
  const { interestEarnedUSDValue, borrowUSDValue: borrowBalance, loanStatus, supplyUSDValue: supplyBalance } = overview;

  if (lendPositions === undefined || borrowPositions === undefined || assets === undefined) {
    console.log(lendPositions, borrowPositions, assets);
    return <LoadingSpinner />;
  }
  return (
    <MainContainer>
      <H1>{t('loans.brand_name')}</H1>
      <Stack spacing='double'>
        <Stack>
          <P>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industrys standard dummy text ever since the 1500s,{' '}
          </P>
          <LoansInsights
            apyEarned={interestEarnedUSDValue}
            borrow={borrowBalance}
            supply={supplyBalance}
            loanStatus={loanStatus}
          />
        </Stack>
        <LoansMarkets borrowPositions={borrowPositions} lendPositions={lendPositions} assets={assets} />
      </Stack>
    </MainContainer>
  );
};

export default LoansOverview;
