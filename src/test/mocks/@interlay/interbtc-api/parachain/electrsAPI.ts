const MOCK_BITCOIN_HEIGHT = 1000;

const mockElectrsAPIGetLatestBlockHeight = jest.fn(() => MOCK_BITCOIN_HEIGHT);

export { MOCK_BITCOIN_HEIGHT, mockElectrsAPIGetLatestBlockHeight };
