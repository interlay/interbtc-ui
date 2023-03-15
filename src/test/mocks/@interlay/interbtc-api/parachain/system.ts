// Change to isError or isShutdown in order to simulate parachain being down.
const SYSTEM_STATUS_RUNNING = { isRunning: true };

const mockSystemGetStatusCode = jest.fn(() => SYSTEM_STATUS_RUNNING);

const DEFAULT_DEADLINE_BLOCK_NUMBER = 0;

const mockGetFutureBlockNumber = jest.fn().mockResolvedValue(DEFAULT_DEADLINE_BLOCK_NUMBER);

export { DEFAULT_DEADLINE_BLOCK_NUMBER, mockGetFutureBlockNumber, mockSystemGetStatusCode };
