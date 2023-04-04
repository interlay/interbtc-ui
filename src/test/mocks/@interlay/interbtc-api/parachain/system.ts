// Change to isError or isShutdown in order to simulate parachain being down.
const SYSTEM_STATUS_RUNNING = { isRunning: true };

const mockSystemGetStatusCode = jest.fn(() => SYSTEM_STATUS_RUNNING);

const DEFAULT_DEADLINE_BLOCK_NUMBER = 0;

const mockGetFutureBlockNumber = jest.fn().mockResolvedValue(DEFAULT_DEADLINE_BLOCK_NUMBER);

const DEFAULT_CURRENT_ACTIVE_BLOCK_NUMBER = 1;

const mockGetCurrentActiveBlockNumber = jest.fn().mockResolvedValue(DEFAULT_CURRENT_ACTIVE_BLOCK_NUMBER);

const DEFAULT_CURRENT_BLOCK_NUMBER = 0;

const mockGetCurrentBlockNumber = jest.fn().mockReturnValue(DEFAULT_CURRENT_BLOCK_NUMBER);

export {
  DEFAULT_CURRENT_ACTIVE_BLOCK_NUMBER,
  DEFAULT_CURRENT_BLOCK_NUMBER,
  DEFAULT_DEADLINE_BLOCK_NUMBER,
  mockGetCurrentActiveBlockNumber,
  mockGetCurrentBlockNumber,
  mockGetFutureBlockNumber,
  mockSystemGetStatusCode
};
