const DEFAULT_BTC_BLOCK_HEIGHT = 1000;

const mockBtcRelayGetLatestBlockHeight = jest.fn(() => DEFAULT_BTC_BLOCK_HEIGHT);

export { mockBtcRelayGetLatestBlockHeight };
