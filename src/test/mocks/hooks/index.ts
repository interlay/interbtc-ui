import { newMonetaryAmount } from '@interlay/interbtc-api';

import { GOVERNANCE_TOKEN, RELAY_CHAIN_NATIVE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';

const mockGetDexVolumeByTicker = jest.fn().mockReturnValue({ amount: newMonetaryAmount(0, WRAPPED_TOKEN), usd: 0 });

const mockgetDexTotalVolumeUSD = jest.fn().mockReturnValue(0);

jest.mock('@/utils/hooks/api/use-get-dex-volume', () => ({
  ...jest.requireActual('@/utils/hooks/api/use-get-dex-volume'),
  useGetDexVolumes: jest.fn().mockReturnValue({
    data: {},
    getDexVolumeByTicker: mockGetDexVolumeByTicker,
    getDexTotalVolumeUSD: mockgetDexTotalVolumeUSD
  })
}));

jest.mock('@/utils/hooks/api/use-get-pools-trading-apr', () => ({
  ...jest.requireActual('@/utils/hooks/api/use-get-pools-trading-apr'),
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
jest.mock('@/utils/hooks/api/use-get-prices', () => ({
  ...jest.requireActual('@/utils/hooks/api/use-get-pools-trading-apr'),
  useGetPrices: jest.fn().mockReturnValue(mockPrices)
}));

jest.mock('@/utils/hooks/api/oracle/use-get-oracle-currencies', () => ({
  ...jest.requireActual('@/utils/hooks/api/oracle/use-get-oracle-currencies'),
  useGetOracleCurrencies: jest.fn().mockReturnValue({ data: [] })
}));

export { mockgetDexTotalVolumeUSD, mockGetDexVolumeByTicker };
