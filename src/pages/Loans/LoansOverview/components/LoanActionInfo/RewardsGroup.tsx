import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';

import { Dd, DlGroup, Dt } from '@/component-library';
import { Prices } from '@/utils/hooks/api/use-get-prices';

import { getApyLabel } from '../../utils/apy';
import { getSubsidyRewardApy } from '../../utils/get-subsidy-rewards-apy';

type RewardsGroupProps = {
  apy: Big;
  rewards: MonetaryAmount<CurrencyExt>;
  assetCurrency: CurrencyExt;
  isBorrow: boolean;
  prices?: Prices;
};

const RewardsGroup = ({ isBorrow, apy, assetCurrency, rewards, prices }: RewardsGroupProps): JSX.Element | null => {
  const subsidyRewardApy = getSubsidyRewardApy(assetCurrency, rewards, prices);

  if (!subsidyRewardApy) {
    return null;
  }

  const totalApy = isBorrow ? apy.sub(subsidyRewardApy) : apy.add(subsidyRewardApy);

  return (
    <>
      <DlGroup justifyContent='space-between'>
        <Dt>Rewards APY {rewards.currency.ticker}</Dt>
        <Dd>{getApyLabel(subsidyRewardApy)}</Dd>
      </DlGroup>
      <DlGroup justifyContent='space-between'>
        <Dt>Total APY</Dt>
        <Dd>{getApyLabel(totalApy)}</Dd>
      </DlGroup>
    </>
  );
};
export { RewardsGroup };
export type { RewardsGroupProps };
