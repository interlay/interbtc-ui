import { CurrencyIdLiteral } from '@interlay/interbtc-api';

import { CoinIcon, Span } from '@/component-library';

import { StyledAsset } from './LoansMarkets.style';

type MarketAssetProps = {
  currency: CurrencyIdLiteral;
};

const MarketAsset = ({ currency }: MarketAssetProps): JSX.Element => (
  <StyledAsset>
    <CoinIcon coin={currency} size='small' />
    <Span>{currency}</Span>
  </StyledAsset>
);

export { MarketAsset };
export type { MarketAssetProps };
