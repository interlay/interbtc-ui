import '@testing-library/jest-dom';

import { CollateralCurrencyExt, CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { BitcoinAmount } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';

import { RELAY_CHAIN_NATIVE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';

const DEFAULT_COLLATERAL_AMOUNT = '1000000000000';
// TODO: Extend with all the data needed for Vaults page.
const DEFAULT_VAULT_WITH_ISSUABLE_TOKENS = (_accountId: AccountId, collateralCurrency: CollateralCurrencyExt) => ({
  backingCollateral: newMonetaryAmount(DEFAULT_COLLATERAL_AMOUNT, collateralCurrency)
});

const mockVaultsGet = jest.fn((accountId, currency) => DEFAULT_VAULT_WITH_ISSUABLE_TOKENS(accountId, currency));

const mockNewVaultId = (vaultAddress: string, collateralToken: CurrencyExt) => ({
  accountId: vaultAddress,
  currencies: {
    collateral: collateralToken,
    wrapped: WRAPPED_TOKEN
  }
});

const mockVaultsWithIssuableTokens = new Map().set(
  // Dummy `vaultAddress` & dummy `collateralToken`
  mockNewVaultId('5GQoBrhX3mfnmKnw2qz2vGvHG8yvf6xT15gGM54865g6qEfE', RELAY_CHAIN_NATIVE_TOKEN),
  new BitcoinAmount(100)
);
const mockVaultsGetVaultsWithIssuableTokens = jest.fn(() => mockVaultsWithIssuableTokens);

export { mockVaultsGet, mockVaultsGetVaultsWithIssuableTokens };
