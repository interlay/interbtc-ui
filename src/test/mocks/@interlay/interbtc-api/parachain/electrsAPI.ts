const DEFAULT_BTC_BLOCK_HEIGHT = 1000;

const mockElectrsAPIGetLatestBlockHeight = jest.fn(() => DEFAULT_BTC_BLOCK_HEIGHT);

export { mockElectrsAPIGetLatestBlockHeight };
