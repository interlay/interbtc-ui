import { LoanAsset } from '@interlay/interbtc-api';

import { Dd, DlGroup, Dt } from '@/component-library';
import { LoanAction } from '@/types/loans';
import { Prices } from '@/utils/hooks/api/use-get-prices';

import { getApyLabel } from '../../utils/apy';
import { RewardsGroup } from './RewardsGroup';

type LoanGroupProps = {
  variant?: Extract<LoanAction, 'borrow' | 'lend'>;
  asset?: LoanAsset;
  prices?: Prices;
};

const LoanGroup = ({ variant, asset, prices }: LoanGroupProps): JSX.Element | null => {
  const isBorrow = variant === 'borrow';
  const apy = isBorrow ? asset?.borrowApy : asset?.lendApy;

  if (!apy || !asset) {
    return null;
  }

  const rewards = isBorrow ? asset?.borrowReward : asset?.lendReward;

  return (
    <>
      <DlGroup justifyContent='space-between'>
        <Dt>
          {isBorrow ? 'Borrow' : 'Lend'} APY {asset.currency.ticker}
        </Dt>
        <Dd>{getApyLabel(apy)}</Dd>
      </DlGroup>
      {!!rewards && (
        <RewardsGroup apy={apy} isBorrow={isBorrow} rewards={rewards} assetCurrency={asset.currency} prices={prices} />
      )}
    </>
  );
};

export { LoanGroup };
export type { LoanGroupProps };
