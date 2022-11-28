import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';

import { formatNumber } from '@/common/utils/utils';
import { Flex } from '@/component-library';
import { Prices } from '@/utils/hooks/api/use-get-prices';

import { getApyLabel } from '../../utils/apy';
import { getSubsidyRewardApy } from '../../utils/get-subsidy-rewards-apy';
import { ApyTooltip } from '../ApyTooltip';
import { MonetaryCell } from './MonetaryCell';

type ApyCellProps = {
  assetApy: Big;
  assetCurrency: CurrencyExt;
  earnedAsset?: MonetaryAmount<CurrencyExt>;
  rewards: MonetaryAmount<CurrencyExt> | null;
  prices?: Prices;
  isBorrow?: boolean;
  onClick?: () => void;
};

const ApyCell = ({
  assetApy,
  assetCurrency,
  rewards,
  earnedAsset,
  prices,
  isBorrow = false,
  onClick
}: ApyCellProps): JSX.Element => {
  const rewardsApy = getSubsidyRewardApy(rewards?.currency, rewards, prices);

  const totalApy = isBorrow ? assetApy.sub(rewardsApy || 0) : assetApy.add(rewardsApy || 0);
  const totalApyLabel = getApyLabel(totalApy);

  const earnedAssetAmount = earnedAsset
    ? formatNumber(earnedAsset?.toBig().toNumber(), {
        maximumFractionDigits: earnedAsset?.currency.humanDecimals
      })
    : undefined;

  const earnedAssetLabel = earnedAsset ? `${earnedAssetAmount} ${earnedAsset.currency.ticker}` : undefined;

  const children = (
    <MonetaryCell onClick={onClick} label={totalApyLabel} sublabel={earnedAssetLabel} alignSelf='flex-start' />
  );

  if (!prices) {
    return children;
  }

  // MEMO: wrapping around a Flex so tooltip is placed correctly
  return (
    <Flex>
      <ApyTooltip
        assetApy={assetApy}
        assetCurrency={assetCurrency}
        prices={prices}
        rewards={rewards}
        rewardsApy={rewardsApy}
        isBorrow={isBorrow}
        earnedAsset={earnedAsset}
      >
        {children}
      </ApyTooltip>
    </Flex>
  );
};

export { ApyCell };
export type { ApyCellProps };
