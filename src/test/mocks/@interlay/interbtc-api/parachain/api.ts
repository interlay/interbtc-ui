import { ApiPromise } from '@polkadot/api';
import { Text, TypeRegistry } from '@polkadot/types';
import { Registry } from '@polkadot/types/types';
import Big from 'big.js';

import { EXTRINSIC } from '../extrinsic';

const REGISTRY = ({ chainDecimals: [], chainSS58: 0, chainTokens: [] } as unknown) as Registry;
const SYSTEM_CHAIN = new Text(REGISTRY, 'interBTC');

const registry = new TypeRegistry();
const CHAIN_TYPE = registry.createType('ChainType', 'Live');

const VESTING_SCHEDULES = {
  EMPTY: [],
  FULL: [{ start: new Big(0), period: new Big(0), periodCount: new Big(1), perPeriod: new Big(1) }]
};

// case Transaction.ESCROW_INCREASE_LOOKED_TIME_AND_AMOUNT: {
//   const [amount, unlockHeight] = params.args;
//   const txs = [
//     window.bridge.api.tx.escrow.increaseAmount(amount.toString(true)),
//     window.bridge.api.tx.escrow.increaseUnlockHeight(unlockHeight)
//   ];
//   const batch = window.bridge.api.tx.utility.batchAll(txs);

//   return { extrinsic: batch };
// }

// add here data that is being used in tests
const DATA = { VESTING_SCHEDULES };

// add here mocks that are being manipulated in tests
const MODULE = {
  vestingSchedules: jest.fn().mockReturnValue(VESTING_SCHEDULES.EMPTY),
  claimVesting: jest.fn().mockReturnValue(EXTRINSIC),
  increaseAmount: jest.fn().mockReturnValue(EXTRINSIC),
  increaseUnlockHeight: jest.fn().mockReturnValue(EXTRINSIC)
};

// maps module to ApiPromise
const PROMISE: Partial<Record<keyof ApiPromise, unknown>> = {
  on: jest.fn(),
  createType: jest.fn().mockImplementation((_, data) => data),
  rpc: {
    system: {
      chain: jest.fn().mockReturnValue(SYSTEM_CHAIN),
      chainType: jest.fn().mockReturnValue(CHAIN_TYPE)
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
    escrow: {
      increaseAmount: MODULE.increaseAmount,
      increaseUnlockHeight: MODULE.increaseAmount
    }
  }
};

const MOCK_API = {
  DATA,
  MODULE,
  PROMISE
};
export { MOCK_API };
