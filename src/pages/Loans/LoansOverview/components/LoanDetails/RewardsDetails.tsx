import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';

import { TransactionDetailsDd, TransactionDetailsDt, TransactionDetailsGroup } from '@/components';
import { getApyLabel, getSubsidyRewardApy } from '@/utils/helpers/loans';
import { Prices } from '@/utils/hooks/api/use-get-prices';

type RewardsDetailsProps = {
  apy: Big;
  rewards: MonetaryAmount<CurrencyExt>;
  assetCurrency: CurrencyExt;
  isBorrow: boolean;
  prices?: Prices;
};

const RewardsDetails = ({ isBorrow, apy, assetCurrency, rewards, prices }: RewardsDetailsProps): JSX.Element | null => {
  const subsidyRewardApy = getSubsidyRewardApy(assetCurrency, rewards, prices);

  if (!subsidyRewardApy) {
    return null;
  }

  const totalApy = isBorrow ? apy.sub(subsidyRewardApy) : apy.add(subsidyRewardApy);

  return (
    <>
      <TransactionDetailsGroup>
        <TransactionDetailsDt>Rewards APR {rewards.currency.ticker}</TransactionDetailsDt>
        <TransactionDetailsDd>{getApyLabel(subsidyRewardApy)}</TransactionDetailsDd>
      </TransactionDetailsGroup>
      <TransactionDetailsGroup>
        <TransactionDetailsDt>Total APY</TransactionDetailsDt>
        <TransactionDetailsDd>{getApyLabel(totalApy)}</TransactionDetailsDd>
      </TransactionDetailsGroup>
    </>
  );
};
export { RewardsDetails };
export type { RewardsDetailsProps };
