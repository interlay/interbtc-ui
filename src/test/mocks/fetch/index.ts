import { newMonetaryAmount } from '@interlay/interbtc-api';

import { RELAY_CHAIN_NATIVE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';
import { issuesQuery } from '@/services/queries/issues';
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
    case input.includes('http://localhost:4000/graphql'): {
      const { query } = JSON.parse(_init.body);

      switch (query) {
        case vaultsByAccountIdQuery(DEFAULT_ACCOUNT_ADDRESS):
          result = {
            vaults: []
          };
          break;
        case issuesQuery(`userParachainAddress_eq: "a3aTRC4zs1djutYS9QuZSB3XmfRgNzFfyRtbZKaoQyv67Yzcc"`):
          result = {
            data: {
              issues: [
                {
                  id: '0x9b0bc5abb87bca076718953b362634646fbbccc76368d2f78104b4be04ff0693',
                  request: {
                    amountWrapped: newMonetaryAmount(100000, WRAPPED_TOKEN, true),
                    bridgeFeeWrapped: newMonetaryAmount(1500, WRAPPED_TOKEN, true),
                    timestamp: new Date('2023-03-17'),
                    height: {
                      absolute: 243298,
                      active: 241957
                    }
                  },
                  userParachainAddress: 'a3czP8uH8BKyS1NpqXkjzEGe5iKNhuTbXmYSNdC47iM9sNmMB',
                  vault: {
                    accountId: 'a3baoFq36qeR3q21sb5hh7m4uJ2rhmmUXxM4uy8ShZj9sFAiX',
                    collateralToken: {
                      token: 'KSM'
                    },
                    wrappedToken: {
                      token: 'KBTC'
                    }
                  },
                  vaultBackingAddress: 'tb1q8ylml0gtdv73s6vzm08gder2l4jf4upfg36zte',
                  vaultWalletPubkey: '0x02a8f111af401369e0ceefc5330a800b5aa3bfe2759dbd2eef5e53b611a4e36e86',
                  griefingCollateral: newMonetaryAmount(100000, RELAY_CHAIN_NATIVE_TOKEN, true),
                  status: 'Expired',
                  refund: null,
                  execution: null,
                  cancellation: null,
                  period: {
                    id: 'initial-1675864050243',
                    value: 14400,
                    height: {
                      absolute: 499,
                      id: '499'
                    },
                    timestamp: new Date('2023-02-08')
                  },
                  backingPayment: {}
                }
              ]
            }
          };
          break;

        default: {
          throw new Error(`mockFetch: provided input [${input}] is not mocked`);
        }
      }

      break;
    }
    default: {
      throw new Error(`mockFetch: provided input [${input}] is not mocked`);
    }
  }
  return Promise.resolve({
    json: () => Promise.resolve(result)
  });
});

// TODO: need to mock with `msw`
global.fetch = mockFetch as any;

export { MOCK_TOKEN_PRICES, mockFetch, mockGovernanceTokenPriceInUsd };
