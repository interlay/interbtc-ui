import { H1, P, Stack } from '@/component-library';
import MainContainer from '@/parts/MainContainer';
import { useGetLoansData } from '@/utils/hooks/api/loans/use-get-loans-data';

import { LoansMarkets, LoansOverview } from './components';

const InterlendOverview = (): JSX.Element => {
  const { positions, supply } = useGetLoansData();
  const { apyEarned, borrow: borrowBalance, loanStatus, supply: supplyBalance } = positions;

  return (
    <MainContainer>
      <H1>Interlend</H1>
      <Stack spacing='double'>
        <Stack>
          <P>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industrys standard dummy text ever since the 1500s,{' '}
          </P>
          <LoansOverview apyEarned={apyEarned} borrow={borrowBalance} supply={supplyBalance} loanStatus={loanStatus} />
        </Stack>
        <LoansMarkets borrow={supply.assets} supply={supply.assets} />
      </Stack>
    </MainContainer>
  );
};

export default InterlendOverview;
