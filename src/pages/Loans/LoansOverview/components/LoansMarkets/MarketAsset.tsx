import { CoinIcon, Span, Tokens } from '@/component-library';

import { StyledAsset } from './LoansMarkets.style';

type MarketAssetProps = {
  currency: string;
};

const MarketAsset = ({ currency }: MarketAssetProps): JSX.Element => (
  <StyledAsset>
    {/* TODO: Get rid of type casting - accept any string as currency ticker in CoinIcon component. */}
    <CoinIcon coin={currency as Tokens} size='small' />
    <Span>{currency}</Span>
  </StyledAsset>
);

export { MarketAsset };
export type { MarketAssetProps };
