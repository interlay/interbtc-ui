import { PRICES_API } from '@/utils/constants/api';

const DEFAULT_PRICES = {
  bitcoin: { usd: 20306 },
  polkadot: { usd: 7.19 },
  'kintsugi-btc': { usd: 20128 },
  kusama: { usd: 48.74 },
  interlay: { usd: 0.057282 },
  kintsugi: { usd: 1.84 }
};

// ray test touch <
// Can mock all fetch calls here based on URL and input.
// This function can be also changed inside the test.
const mockFetch = jest.fn((input, _init?) => {
  let result: unknown;
  switch (input) {
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
// ray test touch >

global.fetch = mockFetch as any;

export { mockFetch };
