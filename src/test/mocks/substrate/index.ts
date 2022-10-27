import '@testing-library/jest-dom';

import * as mocks from './mocks';

const mockUseSubstrate = jest.fn(() => ({
  state: mocks.DEFAULT_SUBSTRATE,
  setSelectedAccount: jest.fn(),
  removeSelectedAccount: jest.fn()
}));

jest.mock('../../../lib/substrate/context/hooks', () => {
  const actualApi = jest.requireActual('../../../lib/substrate/context/hooks');

  return {
    ...actualApi,
    useSubstrate: mockUseSubstrate,
    useSubstrateSecureState: jest.fn(() => mocks.DEFAULT_SUBSTRATE),
    useSubstrateState: jest.fn(() => mocks.DEFAULT_SUBSTRATE)
  };
});

export { mockUseSubstrate };
