import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';

import { Dd, DlGroup, Dt } from '@/component-library';
import { Prices } from '@/utils/hooks/api/use-get-prices';

import { getApyLabel } from '../../utils/apy';
import { RewardsGroup } from './RewardsGroup';

type LoanGroupProps = {
  apy: Big;
  currency: CurrencyExt;
  isBorrow: boolean;
  rewards?: MonetaryAmount<CurrencyExt> | null;
  prices?: Prices;
};

const LoanGroup = ({ isBorrow, apy, currency, rewards, prices }: LoanGroupProps): JSX.Element => (
  <>
    <DlGroup justifyContent='space-between'>
      <Dt>
        {isBorrow ? 'Borrow' : 'Lend'} APY {currency.ticker}
      </Dt>
      <Dd>{getApyLabel(apy)}</Dd>
    </DlGroup>
    {!!rewards && (
      <RewardsGroup apy={apy} isBorrow={isBorrow} rewards={rewards} assetCurrency={currency} prices={prices} />
    )}
  </>
);

export { LoanGroup };
export type { LoanGroupProps };
