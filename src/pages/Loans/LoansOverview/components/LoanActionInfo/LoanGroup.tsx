import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';

import { Dd, DlGroup, Dt } from '@/component-library';
import { Prices } from '@/utils/hooks/api/use-get-prices';

import { getApyLabel } from '../../utils/apy';
import { getSubsidyRewardApy } from '../../utils/get-subsidy-rewards-apy';
import { RewardsGroup } from './RewardsGroup';

type LoanGroupProps = {
  apy: Big;
  ticker: string;
  isBorrow: boolean;
  rewards?: MonetaryAmount<CurrencyExt> | null;
  prices?: Prices;
};

const LoanGroup = ({ isBorrow, apy, ticker, rewards, prices }: LoanGroupProps): JSX.Element => {
  const subsidyRewardApy = getSubsidyRewardApy(rewards?.currency, rewards || null, prices);

  return (
    <>
      <DlGroup justifyContent='space-between'>
        <Dt>
          {isBorrow ? 'Borrow' : 'Lend'} APY {ticker}
        </Dt>
        <Dd>{getApyLabel(apy)}</Dd>
      </DlGroup>
      {!!rewards && !!subsidyRewardApy && (
        <RewardsGroup apy={apy} isBorrow={isBorrow} rewards={rewards} prices={prices} />
      )}
    </>
  );
};
export { LoanGroup };
export type { LoanGroupProps };
