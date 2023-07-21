// const MOCK_COLLATERAL_AMOUNT = '1000000000000';
import { CurrencyExt, InterbtcPrimitivesVaultId, VaultsAPI } from '@interlay/interbtc-api';
import { BitcoinAmount, MonetaryAmount } from '@interlay/monetary-js';

import { DEFAULT_ADDRESS } from '@/test/mocks/@polkadot/constants';

import { MOCK_PRIMITIVES } from '../interbtc-primitives';
import { MOCK_ISSUE } from './issue';

const VAULTS_ID: Record<'RELAY' | 'GOVERNANCE', InterbtcPrimitivesVaultId> = {
  RELAY: {
    accountId: DEFAULT_ADDRESS,
    currencies: {
      collateral: MOCK_PRIMITIVES.RELAY_CHAIN_NATIVE_TOKEN,
      wrapped: MOCK_PRIMITIVES.WRAPPED_TOKEN
    }
  },
  GOVERNANCE: {
    accountId: DEFAULT_ADDRESS,
    currencies: {
      collateral: MOCK_PRIMITIVES.GOVERNANCE_TOKEN,
      wrapped: MOCK_PRIMITIVES.WRAPPED_TOKEN
    }
  }
};

const VAULTS_AMOUNT = {
  EMPTY: new BitcoinAmount(0),
  FULL: new BitcoinAmount(MOCK_ISSUE.DATA.REQUEST_LIMIT.FULL.singleVaultMaxIssuable._rawAmount.toString())
};

const VAULTS_TOKENS = {
  EMPTY: new Map<InterbtcPrimitivesVaultId, MonetaryAmount<CurrencyExt>>([
    [VAULTS_ID.RELAY, VAULTS_AMOUNT.EMPTY],
    [VAULTS_ID.GOVERNANCE, VAULTS_AMOUNT.EMPTY]
  ]),
  FULL: new Map<InterbtcPrimitivesVaultId, MonetaryAmount<CurrencyExt>>([
    // [VAULTS_ID.RELAY, VAULTS_AMOUNT.EMPTY]
    [VAULTS_ID.GOVERNANCE, VAULTS_AMOUNT.FULL]
  ])
};

const DATA = { VAULTS_ID, VAULTS_AMOUNT, VAULTS_TOKENS };

const MODULE: Pick<
  Record<keyof VaultsAPI, jest.Mock<any, any>>,
  'getVaultsWithRedeemableTokens' | 'getVaultsWithIssuableTokens' | 'getPremiumRedeemVaults'
> = {
  getVaultsWithRedeemableTokens: jest.fn().mockResolvedValue(VAULTS_TOKENS.FULL),
  getVaultsWithIssuableTokens: jest.fn().mockResolvedValue(VAULTS_TOKENS.FULL),
  getPremiumRedeemVaults: jest.fn().mockRejectedValue(undefined)
};

const MOCK_VAULTS = {
  DATA,
  MODULE
};

export { MOCK_VAULTS };
