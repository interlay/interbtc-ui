import Big from 'big.js';

import { Dd, Dl, DlGroup, Dt } from '@/component-library';
import { getApyLabel } from '@/utils/helpers/loans';

import { StyledApyTooltipGroup, StyledApyTooltipTitle } from './LoanApyTooltip.style';

type BreakdownGroupProps = {
  apy: Big;
  ticker: string;
  rewardsApy?: Big;
  rewardsTicker?: string;
  isBorrow: boolean;
};

const BreakdownGroup = ({ apy, rewardsApy, ticker, rewardsTicker, isBorrow }: BreakdownGroupProps): JSX.Element => {
  const apyLabel = isBorrow ? `-${getApyLabel(apy)}` : getApyLabel(apy);

  return (
    <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
      <StyledApyTooltipTitle color='primary'>APY Breakdown</StyledApyTooltipTitle>
      <Dt>
        <Dl direction='column' alignItems='flex-start' gap='spacing0'>
          <StyledApyTooltipGroup gap='spacing1' wrap>
            <Dd color='tertiary'>
              {isBorrow ? 'Borrow' : 'Lend'} APY {ticker}:
            </Dd>
            <Dt color='primary'>{apyLabel}</Dt>
          </StyledApyTooltipGroup>
          {!!rewardsApy && (
            <StyledApyTooltipGroup gap='spacing1' wrap>
              <Dd color='tertiary'>Rewards APY {rewardsTicker}:</Dd>
              <Dt color='primary'>{getApyLabel(rewardsApy)}</Dt>
            </StyledApyTooltipGroup>
          )}
        </Dl>
      </Dt>
    </DlGroup>
  );
};

export { BreakdownGroup };
export type { BreakdownGroupProps };
