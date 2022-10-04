import { Card } from '@/component-library';

import { StyledDd, StyledDItem, StyledDl, StyledDt } from './LoansOverview.style';

type LoansOverviewProps = {
  supply: string;
  borrow: string;
  apyEarned: string;
  loanStatus: string;
};

const LoansOverview = ({ supply, apyEarned, borrow, loanStatus }: LoansOverviewProps): JSX.Element => (
  <Card>
    <StyledDl>
      <StyledDItem>
        <StyledDt>Supply Balance</StyledDt>
        <StyledDd>{supply}</StyledDd>
      </StyledDItem>
      <StyledDItem>
        <StyledDt>APY Earned</StyledDt>
        <StyledDd>{apyEarned}</StyledDd>
      </StyledDItem>
      <StyledDItem>
        <StyledDt>Borrow Balance</StyledDt>
        <StyledDd>{borrow}</StyledDd>
      </StyledDItem>
      <StyledDItem>
        <StyledDt>Loan Status</StyledDt>
        <StyledDd>{loanStatus}</StyledDd>
      </StyledDItem>
    </StyledDl>
  </Card>
);

export { LoansOverview };
export type { LoansOverviewProps };
