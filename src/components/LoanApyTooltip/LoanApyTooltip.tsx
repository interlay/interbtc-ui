import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { TooltipProps } from '@reach/tooltip';
import Big from 'big.js';

import { Dd, Dl, DlGroup } from '@/component-library';
import { GOVERNANCE_TOKEN_SYMBOL } from '@/config/relay-chains';
import { Prices } from '@/utils/hooks/api/use-get-prices';

import { AssetGroup } from './AssetGroup';
import { BreakdownGroup } from './BreakdownGroup';
import { StyledApyTooltipTitle, StyledTooltip } from './LoanApyTooltip.style';

type Props = {
  apy: Big;
  currency: CurrencyExt;
  earnedInterest?: MonetaryAmount<CurrencyExt>;
  accumulatedDebt?: MonetaryAmount<CurrencyExt>;
  rewardsApy?: Big;
  prices: Prices;
  isBorrow: boolean;
};

type InheritAttrs = Omit<TooltipProps, keyof Props | 'label'>;

type LoanApyTooltipProps = Props & InheritAttrs;

const LoanApyTooltip = ({
  apy,
  currency,
  earnedInterest,
  accumulatedDebt,
  rewardsApy,
  prices,
  isBorrow,
  ...props
}: LoanApyTooltipProps): JSX.Element => {
  const showEarnedRewards = !!earnedInterest;

  const label = (
    <Dl direction='column' gap='spacing2'>
      <BreakdownGroup
        apy={apy}
        isBorrow={isBorrow}
        rewardsApy={rewardsApy}
        rewardsTicker={GOVERNANCE_TOKEN_SYMBOL}
        ticker={currency.ticker}
      />
      {accumulatedDebt && (
        <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
          <StyledApyTooltipTitle color='primary'>Owed</StyledApyTooltipTitle>
          <Dd>
            <Dl direction='column' alignItems='flex-start' gap='spacing0'>
              <AssetGroup amount={accumulatedDebt} prices={prices} />
            </Dl>
          </Dd>
        </DlGroup>
      )}
      {showEarnedRewards && (
        <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
          <StyledApyTooltipTitle color='primary'>Earned</StyledApyTooltipTitle>
          <Dd>
            <Dl direction='column' alignItems='flex-start' gap='spacing0'>
              {earnedInterest && <AssetGroup amount={earnedInterest} prices={prices} />}
            </Dl>
          </Dd>
        </DlGroup>
      )}
    </Dl>
  );

  return <StyledTooltip {...props} label={label} />;
};

export { LoanApyTooltip };
export type { LoanApyTooltipProps };
