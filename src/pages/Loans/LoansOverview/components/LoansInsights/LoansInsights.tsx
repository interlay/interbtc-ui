import { Card, CTA, Dl, DlGroup } from '@/component-library';

import { StyledDd, StyledDt } from './LoansInsights.style';

type LoansInsightsProps = {
  supply: string | undefined;
  borrow: string | undefined;
  netYield: string | undefined;
  rewards: string | undefined;
  hasEarnedRewards: boolean;
  onClaimRewards: () => void;
};

const LoansInsights = ({
  supply = '-',
  netYield = '-',
  borrow = '-',
  rewards = '-',
  hasEarnedRewards,
  onClaimRewards
}: LoansInsightsProps): JSX.Element => (
  <Dl wrap direction='row'>
    <Card flex='1'>
      <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
        <StyledDt color='primary'>Supply Balance</StyledDt>
        <StyledDd color='secondary'>{supply}</StyledDd>
      </DlGroup>
    </Card>
    <Card flex='1'>
      <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
        <StyledDt color='primary'>Borrow Balance</StyledDt>
        <StyledDd color='secondary'>{borrow}</StyledDd>
      </DlGroup>
    </Card>
    <Card flex='1'>
      <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
        <StyledDt color='primary'>Net Yield</StyledDt>
        <StyledDd color='secondary'>{netYield}</StyledDd>
      </DlGroup>
    </Card>
    <Card
      direction='row'
      flex={hasEarnedRewards ? '1.5' : '1'}
      gap='spacing2'
      alignItems='center'
      justifyContent='space-between'
    >
      <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
        <StyledDt color='primary'>Rewards</StyledDt>
        <StyledDd color='secondary'>{rewards}</StyledDd>
      </DlGroup>
      {hasEarnedRewards && <CTA onClick={onClaimRewards}>Claim</CTA>}
    </Card>
  </Dl>
);

export { LoansInsights };
export type { LoansInsightsProps };