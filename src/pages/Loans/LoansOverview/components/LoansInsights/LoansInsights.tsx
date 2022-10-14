import { Card } from '@/component-library';

import { StyledDd, StyledDItem, StyledDl, StyledDt } from './LoansInsights.style';

type LoansInsightsProps = {
  supply: string | undefined;
  borrow: string | undefined;
  apyEarned: string | undefined;
  loanStatus: string | undefined;
};

const LoansInsights = ({ supply, apyEarned, borrow, loanStatus }: LoansInsightsProps): JSX.Element => (
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

export { LoansInsights };
export type { LoansInsightsProps };
