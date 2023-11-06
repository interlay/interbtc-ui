import { newMonetaryAmount } from '@interlay/interbtc-api';
import { ApiPromise } from '@polkadot/api';
import { Text, TypeRegistry } from '@polkadot/types';
import { Registry } from '@polkadot/types/types';
import Big from 'big.js';

import { GOVERNANCE_TOKEN } from '@/config/relay-chains';

import { EXTRINSIC } from '../extrinsic';

const REGISTRY = ({ chainDecimals: [], chainSS58: 0, chainTokens: [] } as unknown) as Registry;
const SYSTEM_CHAIN = new Text(REGISTRY, 'interBTC');

const registry = new TypeRegistry();
const CHAIN_TYPE = registry.createType('ChainType', 'Live');

const VESTING_SCHEDULES = {
  EMPTY: [],
  FULL: [{ start: new Big(0), period: new Big(0), periodCount: new Big(1), perPeriod: new Big(1) }]
};

// add here data that is being used in tests
const DATA = { VESTING_SCHEDULES };

// add here mocks that are being manipulated in tests
const MODULE = {
  vestingSchedules: jest.fn().mockReturnValue(VESTING_SCHEDULES.EMPTY),
  claimVesting: jest.fn().mockReturnValue(EXTRINSIC),
  batchAll: jest.fn().mockReturnValue(EXTRINSIC),
  freeStakable: jest.fn().mockResolvedValue(newMonetaryAmount(10000000000000, GOVERNANCE_TOKEN, true))
};

// maps module to ApiPromise
const PROMISE: Partial<Record<keyof ApiPromise, unknown>> = {
  on: jest.fn(),
  createType: jest.fn().mockImplementation((_, data) => data),
  rpc: {
    system: {
      chain: jest.fn().mockReturnValue(SYSTEM_CHAIN),
      chainType: jest.fn().mockReturnValue(CHAIN_TYPE)
    },
    escrow: {
      freeStakable: MODULE.freeStakable
    }
  },
  query: {
    vesting: {
      vestingSchedules: MODULE.vestingSchedules
    },
    oracle: {
      aggregate: {
        keys: jest.fn().mockReturnValue([])
      }
    }
  },
  tx: {
    vesting: {
      claim: MODULE.claimVesting
    },
    multiTransactionPayment: {
      withFeeSwapPath: jest.fn().mockReturnValue(EXTRINSIC)
    },
    utility: {
      batchAll: MODULE.batchAll
    }
  }
};

const MOCK_API = {
  DATA,
  MODULE,
  PROMISE
};
export { MOCK_API };
