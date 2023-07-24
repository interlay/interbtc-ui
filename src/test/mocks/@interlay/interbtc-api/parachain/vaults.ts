import { CurrencyExt, InterbtcPrimitivesVaultId, VaultsAPI } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { GOVERNANCE_TOKEN, RELAY_CHAIN_NATIVE_TOKEN } from '@/config/relay-chains';
import { DEFAULT_ADDRESS } from '@/test/mocks/@polkadot/constants';

import { MOCK_PRIMITIVES } from '../interbtc-primitives';
import { MOCK_ISSUE } from './issue';

const { ISSUE_AMOUNTS } = MOCK_ISSUE.DATA;

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

const VAULT_COLLATERAL: Record<'RELAY' | 'GOVERNANCE', CurrencyExt> = {
  RELAY: RELAY_CHAIN_NATIVE_TOKEN,
  GOVERNANCE: GOVERNANCE_TOKEN
};

const VAULTS_TOKENS = {
  EMPTY: new Map<InterbtcPrimitivesVaultId, MonetaryAmount<CurrencyExt>>([
    [VAULTS_ID.RELAY, ISSUE_AMOUNTS.EMPTY],
    [VAULTS_ID.GOVERNANCE, ISSUE_AMOUNTS.EMPTY]
  ]),
  FULL: new Map<InterbtcPrimitivesVaultId, MonetaryAmount<CurrencyExt>>([
    [VAULTS_ID.RELAY, ISSUE_AMOUNTS.FULL],
    [VAULTS_ID.GOVERNANCE, ISSUE_AMOUNTS.HALF]
  ])
};

const DATA = { VAULTS_ID, VAULTS_TOKENS, VAULT_COLLATERAL };

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
