import '@testing-library/jest-dom';

import { DEFAULT_ACCOUNTS } from '../../substrate/mocks';

// Must return empty array, so default account will be chosen.
const mockWeb3Enable = jest.fn(() => []);
const mockWeb3Accounts = jest.fn().mockResolvedValue(DEFAULT_ACCOUNTS);

jest.mock('@polkadot/extension-dapp', () => ({
  web3Enable: mockWeb3Enable,
  web3Accounts: mockWeb3Accounts
}));

export { mockWeb3Accounts, mockWeb3Enable };
