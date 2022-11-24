import Big from 'big.js';

import { Dd, Dl, DlGroup, Dt } from '@/component-library';

import { getApyLabel, getLoanApy } from '../../utils/apy';
import { StyledApyTooltipGroup, StyledApyTooltipTitle } from './ApyTooltip.style';

type BreakdownGroupProps = {
  assetApy: Big;
  assetTicker: string;
  rewardsApy?: Big;
  rewardsTicker?: string;
  isBorrow: boolean;
};

const BreakdownGroup = ({
  assetApy,
  rewardsApy,
  assetTicker,
  rewardsTicker,
  isBorrow
}: BreakdownGroupProps): JSX.Element => {
  const loanApy = getLoanApy(assetApy, isBorrow);
  const loanApyLabel = getApyLabel(loanApy);

  return (
    <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
      <StyledApyTooltipTitle>APY Breakdown</StyledApyTooltipTitle>
      <Dt>
        <Dl direction='column' alignItems='flex-start' gap='spacing0'>
          <StyledApyTooltipGroup gap='spacing1' wrap>
            <Dd color='tertiary'>
              {isBorrow ? 'Borrow' : 'Lend'} APY {assetTicker}:
            </Dd>
            <Dt color='primary'>{loanApyLabel}</Dt>
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
