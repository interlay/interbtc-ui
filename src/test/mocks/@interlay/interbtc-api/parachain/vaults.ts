import '@testing-library/jest-dom';

import {
  CollateralCurrencyExt,
  // ray test touch <
  CurrencyExt,
  // ray test touch >
  newMonetaryAmount
} from '@interlay/interbtc-api';
// ray test touch <
import { BitcoinAmount } from '@interlay/monetary-js';
// ray test touch >
import { AccountId } from '@polkadot/types/interfaces';

// ray test touch <
import { RELAY_CHAIN_NATIVE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';
// ray test touch >

const DEFAULT_COLLATERAL_AMOUNT = '1000000000000';
// TODO: Extend with all the data needed for Vaults page.
const DEFAULT_VAULT_WITH_ISSUABLE_TOKENS = (_accountId: AccountId, collateralCurrency: CollateralCurrencyExt) => ({
  backingCollateral: newMonetaryAmount(DEFAULT_COLLATERAL_AMOUNT, collateralCurrency)
});

const mockVaultsGet = jest.fn((accountId, currency) => DEFAULT_VAULT_WITH_ISSUABLE_TOKENS(accountId, currency));

// ray test touch <
const mockNewVaultId = (vaultAddress: string, collateralToken: CurrencyExt) => ({
  accountId: vaultAddress,
  currencies: {
    collateral: collateralToken,
    wrapped: WRAPPED_TOKEN
  }
});

const mockVaultsWithIssuableTokens = new Map().set(
  mockNewVaultId('5GQoBrhX3mfnmKnw2qz2vGvHG8yvf6xT15gGM54865g6qEfE', RELAY_CHAIN_NATIVE_TOKEN),
  new BitcoinAmount(100)
);
const mockVaultsGetVaultsWithIssuableTokens = jest.fn(() => mockVaultsWithIssuableTokens);
// ray test touch >

export { mockVaultsGet, mockVaultsGetVaultsWithIssuableTokens };
