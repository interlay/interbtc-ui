import { LoanAsset } from '@interlay/interbtc-api';

import { TransactionDetails, TransactionDetailsDd, TransactionDetailsDt, TransactionDetailsGroup } from '@/components';
import { LoanAction } from '@/types/loans';
import { Prices } from '@/utils/hooks/api/use-get-prices';

import { getApyLabel } from '../../utils/apy';
import { RewardsDetails } from './RewardsDetails';

type LoanDetailsProps = {
  variant?: LoanAction;
  asset?: LoanAsset;
  prices?: Prices;
};

const LoanDetails = ({ variant, asset, prices }: LoanDetailsProps): JSX.Element | null => {
  const isBorrow = variant === 'borrow';
  const apy = isBorrow ? asset?.borrowApy : asset?.lendApy;

  if (!apy || !asset) {
    return null;
  }

  const rewards = isBorrow ? asset?.borrowReward : asset?.lendReward;

  return (
    <TransactionDetails>
      <TransactionDetailsGroup>
        <TransactionDetailsDt>
          {isBorrow ? 'Borrow' : 'Lend'} APY {asset.currency.ticker}
        </TransactionDetailsDt>
        <TransactionDetailsDd>{getApyLabel(apy)}</TransactionDetailsDd>
      </TransactionDetailsGroup>
      {!!rewards && (
        <RewardsDetails
          apy={apy}
          isBorrow={isBorrow}
          rewards={rewards}
          assetCurrency={asset.currency}
          prices={prices}
        />
      )}
    </TransactionDetails>
  );
};
export { LoanDetails };
export type { LoanDetailsProps };
