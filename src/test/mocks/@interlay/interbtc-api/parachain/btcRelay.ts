const MOCK_BTC_RELAY_HEIGHT = 1000;

const mockBtcRelayGetLatestBlockHeight = jest.fn(() => MOCK_BTC_RELAY_HEIGHT);

const DEFAULT_STABLE_PARACHAIN_CONFIRMATION = 1;

const DEFAULT_STABLE_BITCOIN_CONFIRMATION = 1;

const mockGetStableParachainConfirmations = jest.fn().mockReturnValue(DEFAULT_STABLE_PARACHAIN_CONFIRMATION);

const mockGetStableBitcoinConfirmations = jest.fn().mockReturnValue(DEFAULT_STABLE_BITCOIN_CONFIRMATION);

export {
  DEFAULT_STABLE_BITCOIN_CONFIRMATION,
  DEFAULT_STABLE_PARACHAIN_CONFIRMATION,
  MOCK_BTC_RELAY_HEIGHT,
  mockBtcRelayGetLatestBlockHeight,
  mockGetStableBitcoinConfirmations,
  mockGetStableParachainConfirmations
};
