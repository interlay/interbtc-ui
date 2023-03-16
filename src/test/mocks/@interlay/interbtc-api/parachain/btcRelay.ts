const MOCK_BTC_RELAY_HEIGHT = 1000;

const mockBtcRelayGetLatestBlockHeight = jest.fn(() => MOCK_BTC_RELAY_HEIGHT);

export { MOCK_BTC_RELAY_HEIGHT, mockBtcRelayGetLatestBlockHeight };
