import { PRICES_API } from '@/utils/constants/api';

const MOCK_BITCOIN_PRICE_IN_USD = 20306;

const DEFAULT_PRICES = {
  // ray test touch <<
  bitcoin: { usd: MOCK_BITCOIN_PRICE_IN_USD },
  // ray test touch >>
  polkadot: { usd: 7.19 },
  'kintsugi-btc': { usd: 20128 },
  kusama: { usd: 48.74 },
  interlay: { usd: 0.057282 },
  kintsugi: { usd: 1.84 }
};

// Can mock all fetch calls here based on URL and input.
// This function can be also changed inside the test.
const mockFetch = jest.fn((input, _init?) => {
  let result: unknown;
  switch (true) {
    case input.includes(PRICES_API.URL):
      result = DEFAULT_PRICES;
      break;
    default: {
      throw new Error(`mockFetch: provided input [${input}] is not mocked`);
    }
  }
  return Promise.resolve({
    json: () => Promise.resolve(result)
  });
});

global.fetch = mockFetch as any;

export { MOCK_BITCOIN_PRICE_IN_USD, mockFetch };
