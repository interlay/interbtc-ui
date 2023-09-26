import { SystemAPI } from '@interlay/interbtc-api';

// Change to isError or isShutdown in order to simulate parachain being down.
const STATUS_CODE = { isRunning: true };

const FUTURE_BLOCK_NUMBER = 0;

const CURRENT_ACTIVE_BLOCK_NUMBER = 1;

const CURRENT_BLOCK_NUMBER = 0;

const DATA = {
  STATUS_CODE,
  BLOCK_NUMBER: {
    CURRENT: CURRENT_BLOCK_NUMBER,
    CURRENT_ACTIVE: CURRENT_ACTIVE_BLOCK_NUMBER,
    FUTURE: FUTURE_BLOCK_NUMBER
  }
};

const MODULE: Record<keyof SystemAPI, jest.Mock<any, any>> = {
  getCurrentActiveBlockNumber: jest.fn().mockResolvedValue(CURRENT_ACTIVE_BLOCK_NUMBER),
  getCurrentBlockNumber: jest.fn().mockResolvedValue(CURRENT_BLOCK_NUMBER),
  getFutureBlockNumber: jest.fn().mockResolvedValue(FUTURE_BLOCK_NUMBER),
  getBlockHash: jest.fn(),
  setCode: jest.fn(),
  subscribeToCurrentBlockHeads: jest.fn(),
  subscribeToFinalizedBlockHeads: jest.fn()
};

const MOCK_SYSTEM = {
  DATA,
  MODULE
};

export { MOCK_SYSTEM };
