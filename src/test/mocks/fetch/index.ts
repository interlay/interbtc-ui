import { PRICES_API } from '@/utils/constants/api';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';

let mockGovernanceTokenPriceInUsd: number;
if (process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT) {
  mockGovernanceTokenPriceInUsd = 0.057282;
} else if (process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA) {
  mockGovernanceTokenPriceInUsd = 1.84;
} else {
  throw new Error('Something went wrong!');
}

const MOCK_TOKEN_PRICES = {
  bitcoin: { usd: 20306 },
  polkadot: { usd: 7.19 },
  'kintsugi-btc': { usd: 20128 },
  kusama: { usd: 48.74 },
  interlay: { usd: mockGovernanceTokenPriceInUsd },
  kintsugi: { usd: mockGovernanceTokenPriceInUsd }
};

// Can mock all fetch calls here based on URL and input.
// This function can be also changed inside the test.
const mockFetch = jest.fn((input, _init?) => {
  let result: unknown;
  switch (true) {
    case input.includes(PRICES_API.URL):
      result = MOCK_TOKEN_PRICES;
      break;
    default: {
      // ray test touch <
      throw new Error(`mockFetch: provided input [${input}] is not mocked`);
      // ray test touch >
    }
  }
  return Promise.resolve({
    json: () => Promise.resolve(result)
  });
});

global.fetch = mockFetch as any;

export { MOCK_TOKEN_PRICES, mockFetch, mockGovernanceTokenPriceInUsd };
