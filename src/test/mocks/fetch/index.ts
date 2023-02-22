import vaultsByAccountIdQuery from '@/services/queries/vaults-by-accountId-query';
import { PRICES_API } from '@/utils/constants/api';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';

import { DEFAULT_ACCOUNT_ADDRESS } from '../substrate/mocks';

let mockGovernanceTokenPriceInUsd: number;
if (process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT) {
  mockGovernanceTokenPriceInUsd = 0.057282;
} else if (process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA) {
  mockGovernanceTokenPriceInUsd = 1.84;
} else {
  throw new Error('Something went wrong!');
}

const DEFAULT_PRICES = {
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

  if (input.includes(PRICES_API.URL)) {
    result = DEFAULT_PRICES;
  } else if (input.includes('http://localhost:4000/graphql')) {
    const { query } = JSON.parse(_init.body);
    if (query === vaultsByAccountIdQuery(DEFAULT_ACCOUNT_ADDRESS)) {
      result = {
        vaults: []
      };
    } else {
      throw new Error(`mockFetch: provided input [${input}] is not mocked`);
    }
  } else {
    throw new Error(`mockFetch: provided input [${input}] is not mocked`);
  }

  return Promise.resolve({
    json: () => Promise.resolve(result)
  });
});

// TODO: need to mock with `msw`
global.fetch = mockFetch as any;

export { DEFAULT_PRICES, mockFetch, mockGovernanceTokenPriceInUsd };
