import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { displayMonetaryAmountInUSDFormat, formatNumber } from '@/common/utils/utils';
import { Dd, Dt } from '@/component-library';
import { Prices } from '@/utils/hooks/api/use-get-prices';

import { StyledApyTooltipGroup } from './ApyTooltip.style';

type RewardsGroupProps = {
  rewards: MonetaryAmount<CurrencyExt>;
  prices: Prices;
};

const RewardsGroup = ({ rewards, prices }: RewardsGroupProps): JSX.Element => {
  const rewardsUSD = displayMonetaryAmountInUSDFormat(rewards, prices?.[rewards.currency.ticker].usd);

  const rewardsLabel = `${formatNumber(rewards?.toBig().toNumber(), {
    maximumFractionDigits: rewards?.currency.humanDecimals
  })} (${rewardsUSD})`;

  return (
    <StyledApyTooltipGroup gap='spacing1' wrap>
      <Dt color='tertiary'>{rewards.currency.ticker}:</Dt>
      <Dd color='primary'>{rewardsLabel}</Dd>
    </StyledApyTooltipGroup>
  );
};

export { RewardsGroup };
export type { RewardsGroupProps };
