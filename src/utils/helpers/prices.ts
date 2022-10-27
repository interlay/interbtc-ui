import { Price, Prices } from '../hooks/api/use-get-prices';

const getTokenPrice = (prices: Prices | undefined, ticker: string): Price | undefined => prices?.[ticker];

export { getTokenPrice };
