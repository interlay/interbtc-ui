import { CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';

import { GOVERNANCE_TOKEN, RELAY_CHAIN_NATIVE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';
import { NATIVE_CURRENCIES } from '@/utils/constants/currency';

const mockGetDexVolumeByTicker = jest.fn().mockReturnValue({ amount: newMonetaryAmount(0, WRAPPED_TOKEN), usd: 0 });

const mockgetDexTotalVolumeUSD = jest.fn().mockReturnValue(0);

jest.mock('@/hooks/api/use-get-dex-volume', () => ({
  ...jest.requireActual('@/hooks/api/use-get-dex-volume'),
  useGetDexVolumes: jest.fn().mockReturnValue({
    data: {},
    getDexVolumeByTicker: mockGetDexVolumeByTicker,
    getDexTotalVolumeUSD: mockgetDexTotalVolumeUSD
  })
}));

jest.mock('@/hooks/api/use-get-pools-trading-apr', () => ({
  ...jest.requireActual('@/hooks/api/use-get-pools-trading-apr'),
  useGetPoolsTradingApr: jest.fn().mockReturnValue({
    isLoading: false,
    getTradingAprOfPool: jest.fn().mockReturnValue(2)
  })
}));

const mockPrices = {
  BTC: { usd: 20306 },
  [RELAY_CHAIN_NATIVE_TOKEN.ticker]: { usd: 7.19 },
  [WRAPPED_TOKEN.ticker]: { usd: 20306 },
  [GOVERNANCE_TOKEN.ticker]: { usd: 0.057282 }
};
jest.mock('@/hooks/api/use-get-prices', () => ({
  ...jest.requireActual('@/hooks/api/use-get-pools-trading-apr'),
  useGetPrices: jest.fn().mockReturnValue(mockPrices)
}));

const mockGetPositionEarnings = jest
  .fn()
  .mockImplementation((ticker: string) =>
    newMonetaryAmount(0, NATIVE_CURRENCIES.find((t) => t.ticker === ticker) as CurrencyExt)
  );
const mockPositionsEarnings = {
  [RELAY_CHAIN_NATIVE_TOKEN.ticker]: newMonetaryAmount(0, RELAY_CHAIN_NATIVE_TOKEN),
  [WRAPPED_TOKEN.ticker]: newMonetaryAmount(0, RELAY_CHAIN_NATIVE_TOKEN),
  [GOVERNANCE_TOKEN.ticker]: newMonetaryAmount(0, RELAY_CHAIN_NATIVE_TOKEN)
};
jest.mock('@/hooks/api/loans/use-get-account-positions-earnings', () => ({
  ...jest.requireActual('@/hooks/api/loans/use-get-account-positions-earnings'),
  useGetAccountPositionsEarnings: jest.fn().mockReturnValue({
    isLoading: false,
    data: mockPositionsEarnings,
    getPositionEarnings: mockGetPositionEarnings
  })
}));

export { mockgetDexTotalVolumeUSD, mockGetDexVolumeByTicker };
