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
  apy: Big;
  currency: CurrencyExt;
  earnedInterest?: MonetaryAmount<CurrencyExt>;
  accumulatedDebt?: MonetaryAmount<CurrencyExt>;
  rewards: MonetaryAmount<CurrencyExt> | null;
  prices?: Prices;
  isBorrow?: boolean;
  onClick?: () => void;
};

const ApyCell = ({
  apy,
  currency,
  rewards,
  accumulatedDebt,
  earnedInterest,
  prices,
  isBorrow = false,
  onClick
}: ApyCellProps): JSX.Element => {
  const rewardsApy = getSubsidyRewardApy(currency, rewards, prices);

  const totalApy = isBorrow ? apy.sub(rewardsApy || 0) : apy.add(rewardsApy || 0);
  const totalApyLabel = getApyLabel(totalApy);

  const earnedAsset = accumulatedDebt || earnedInterest;

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
        apy={apy}
        currency={currency}
        prices={prices}
        rewards={rewards}
        rewardsApy={rewardsApy}
        isBorrow={isBorrow}
        accumulatedDebt={accumulatedDebt}
        earnedInterest={earnedInterest}
      >
        {children}
      </ApyTooltip>
    </Flex>
  );
};

export { ApyCell };
export type { ApyCellProps };
