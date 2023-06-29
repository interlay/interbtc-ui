// import { useGetDexVolumes } from '@/utils/hooks/api/use-get-dex-volume';

import { newMonetaryAmount } from '@interlay/interbtc-api';

import { WRAPPED_TOKEN } from '@/config/relay-chains';

const mockGetDexVolumeByTicker = jest.fn().mockReturnValue({ amount: newMonetaryAmount(0, WRAPPED_TOKEN), usd: 0 });

const mockgetDexTotalVolumeUSD = jest.fn().mockReturnValue(0);

jest.mock('@/utils/hooks/api/use-get-dex-volume', () => ({
  ...jest.requireActual('@/utils/hooks/api/use-get-dex-volume'),
  data: {},
  getDexVolumeByTicker: mockGetDexVolumeByTicker,
  getDexTotalVolumeUSD: mockgetDexTotalVolumeUSD
}));

export { mockgetDexTotalVolumeUSD, mockGetDexVolumeByTicker };
