import { LoanAsset } from '@interlay/interbtc-api';

import { Dd, DlGroup, Dt } from '@/component-library';
import { Prices } from '@/utils/hooks/api/use-get-prices';

import { getApyLabel } from '../../utils/apy';
import { getSubsidyRewardApy } from '../../utils/get-subsidy-rewards-apy';

type LendGroupProps = {
  asset: LoanAsset;
  prices?: Prices;
};

const LendGroup = ({ asset, prices }: LendGroupProps): JSX.Element => {
  const subsidyRewardApy = getSubsidyRewardApy(asset?.lendReward?.currency, asset?.lendReward || null, prices);

  return (
    <>
      <DlGroup justifyContent='space-between'>
        <Dt>Lend APY {asset.currency.ticker}</Dt>
        <Dd>{getApyLabel(asset.lendApy)}</Dd>
      </DlGroup>
      {!!asset.lendReward && !!subsidyRewardApy && (
        <>
          <DlGroup justifyContent='space-between'>
            <Dt>Rewards APY {asset.lendReward.currency.ticker}</Dt>
            <Dd>{getApyLabel(subsidyRewardApy)}</Dd>
          </DlGroup>
          <DlGroup justifyContent='space-between'>
            <Dt>Total APY</Dt>
            <Dd>{getApyLabel(asset.lendApy.add(subsidyRewardApy))}</Dd>
          </DlGroup>
        </>
      )}
    </>
  );
};
export { LendGroup };
export type { LendGroupProps };
