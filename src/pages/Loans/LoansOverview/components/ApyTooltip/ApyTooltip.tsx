import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { TooltipProps } from '@reach/tooltip';
import Big from 'big.js';

import { Dl } from '@/component-library';
import { Prices } from '@/utils/hooks/api/use-get-prices';

import { StyledTooltip } from './ApyTooltip.style';
import { BreakdownGroup } from './BreakdownGroup';
import { EarnedGroup } from './EarnedGroup';

type Props = {
  assetApy: Big;
  assetCurrency: CurrencyExt;
  earnedAsset?: MonetaryAmount<CurrencyExt>;
  rewardsApy?: Big;
  rewards: MonetaryAmount<CurrencyExt> | null;
  prices: Prices;
  isBorrow: boolean;
};

type InheritAttrs = Omit<TooltipProps, keyof Props | 'label'>;

type ApyTooltipProps = Props & InheritAttrs;

const ApyTooltip = ({
  assetApy,
  assetCurrency,
  earnedAsset,
  rewardsApy,
  rewards,
  prices,
  isBorrow,
  ...props
}: ApyTooltipProps): JSX.Element => {
  const label = (
    <Dl direction='column' gap='spacing2'>
      <BreakdownGroup
        assetApy={assetApy}
        isBorrow={isBorrow}
        rewardsApy={rewardsApy}
        rewardsTicker={rewards?.currency.ticker}
        assetTicker={assetCurrency.ticker}
      />
      {earnedAsset && (
        <EarnedGroup
          assetCurrency={assetCurrency}
          earnedAsset={earnedAsset}
          isBorrow={isBorrow}
          prices={prices}
          rewards={rewards}
        />
      )}
    </Dl>
  );

  return <StyledTooltip {...props} label={label} />;
};

export { ApyTooltip };
export type { ApyTooltipProps };
