import { LoanAsset } from '@interlay/interbtc-api';

import { TransactionDetails, TransactionDetailsDd, TransactionDetailsDt, TransactionDetailsGroup } from '@/components';
import { LoanAction } from '@/types/loans';
import { Prices } from '@/utils/hooks/api/use-get-prices';

import { getApyLabel } from '../../utils/apy';
import { RewardsDetailsGroup } from './RewardsDetailsGroup';

type DepositDetailsProps = {
  variant?: LoanAction;
  asset?: LoanAsset;
  prices?: Prices;
};

const DepositDetails = ({ variant, asset, prices }: DepositDetailsProps): JSX.Element | null => {
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
        <RewardsDetailsGroup
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
export { DepositDetails };
export type { DepositDetailsProps };
