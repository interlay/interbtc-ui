// Change to isError or isShutdown in order to simulate parachain being down.
const SYSTEM_STATUS_RUNNING = { isRunning: true };

const mockSystemGetStatusCode = jest.fn(() => SYSTEM_STATUS_RUNNING);

export { mockSystemGetStatusCode }
