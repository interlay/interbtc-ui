import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';

import { Flex } from '@/component-library';
import { getApyLabel, getSubsidyRewardApy } from '@/utils/helpers/loans';
import { Prices } from '@/utils/hooks/api/use-get-prices';

import { Cell } from '../DataGrid';
import { LoanApyTooltip } from '../LoanApyTooltip';

type ApyCellProps = {
  apy: Big;
  currency: CurrencyExt;
  earnedInterest?: MonetaryAmount<CurrencyExt>;
  accumulatedDebt?: MonetaryAmount<CurrencyExt>;
  rewardsPerYear: MonetaryAmount<CurrencyExt> | null;
  accruedRewards: MonetaryAmount<CurrencyExt> | null;
  prices?: Prices;
  isBorrow?: boolean;
  onClick?: () => void;
};

const ApyCell = ({
  apy,
  currency,
  rewardsPerYear,
  accruedRewards,
  accumulatedDebt,
  earnedInterest,
  prices,
  isBorrow = false,
  onClick
}: ApyCellProps): JSX.Element => {
  const rewardsApy = getSubsidyRewardApy(currency, rewardsPerYear, prices);

  const totalApy = isBorrow ? apy.sub(rewardsApy || 0) : apy.add(rewardsApy || 0);

  const totalApyLabel = getApyLabel(totalApy);

  const earnedAsset = accumulatedDebt || earnedInterest;

  const earnedAssetLabel = earnedAsset ? `${earnedAsset.toHuman(8)} ${earnedAsset.currency.ticker}` : undefined;

  const children = <Cell onClick={onClick} label={totalApyLabel} sublabel={earnedAssetLabel} alignSelf='flex-start' />;

  if (!prices) {
    return children;
  }

  // MEMO: wrapping around a Flex so tooltip is placed correctly
  return (
    <Flex>
      <LoanApyTooltip
        apy={apy}
        currency={currency}
        prices={prices}
        rewards={accruedRewards}
        rewardsApy={rewardsApy}
        isBorrow={isBorrow}
        accumulatedDebt={accumulatedDebt}
        earnedInterest={earnedInterest}
      >
        {children}
      </LoanApyTooltip>
    </Flex>
  );
};

export { ApyCell };
export type { ApyCellProps };
