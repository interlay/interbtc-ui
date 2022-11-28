import { LoanAsset } from '@interlay/interbtc-api';

import { Dd, DlGroup, Dt } from '@/component-library';
import { Prices } from '@/utils/hooks/api/use-get-prices';

import { getApyLabel } from '../../utils/apy';
import { getSubsidyRewardApy } from '../../utils/get-subsidy-rewards-apy';

type BorrowGroupProps = {
  asset: LoanAsset;
  prices?: Prices;
};

const BorrowGroup = ({ asset, prices }: BorrowGroupProps): JSX.Element => {
  const subsidyRewardApy = getSubsidyRewardApy(asset?.borrowReward?.currency, asset?.borrowReward || null, prices);

  return (
    <>
      <DlGroup justifyContent='space-between'>
        <Dt>Borrow APY {asset.currency.ticker}</Dt>
        <Dd>{getApyLabel(asset.borrowApy)}</Dd>
      </DlGroup>
      {!!asset.borrowReward && !!subsidyRewardApy && (
        <>
          <DlGroup justifyContent='space-between'>
            <Dt>Rewards APY {asset.borrowReward.currency.ticker}</Dt>
            <Dd>{getApyLabel(subsidyRewardApy)}</Dd>
          </DlGroup>
          <DlGroup justifyContent='space-between'>
            <Dt>Total APY</Dt>
            <Dd>{getApyLabel(asset.borrowApy.sub(subsidyRewardApy))}</Dd>
          </DlGroup>
        </>
      )}
    </>
  );
};
export { BorrowGroup };
export type { BorrowGroupProps };
