import { newMonetaryAmount, TransactionAPI } from '@interlay/interbtc-api';

import { GOVERNANCE_TOKEN } from '@/config/relay-chains';

const MODULE: Record<keyof TransactionAPI, jest.Mock<any, any>> = {
  getFeeEstimate: jest.fn().mockResolvedValue(newMonetaryAmount(0, GOVERNANCE_TOKEN)),
  setAccount: jest.fn(),
  sendLogged: jest.fn(),
  removeAccount: jest.fn(),
  getAccount: jest.fn(),
  dryRun: jest.fn(),
  buildBatchExtrinsic: jest.fn(),
  api: {} as any
};

const MOCK_TRANSACTION = {
  MODULE
};

export { MOCK_TRANSACTION };
