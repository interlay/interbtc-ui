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

// ray test touch <
const DEFAULT_VAULT_ADDRESS = '5GQoBrhX3mfnmKnw2qz2vGvHG8yvf6xT15gGM54865g6qEfE';

const DEFAULT_COLLATERAL_TOKEN = RELAY_CHAIN_NATIVE_TOKEN;

const DEFAULT_BITCOIN_AMOUNT = 100;
// ray test touch >

const mockVaults = new Map().set(
  mockNewVaultId(DEFAULT_VAULT_ADDRESS, DEFAULT_COLLATERAL_TOKEN),
  new BitcoinAmount(DEFAULT_BITCOIN_AMOUNT)
);
const mockVaultsGetVaultsWithIssuableTokens = jest.fn(() => mockVaults);

// ray test touch <
const mockVaultsGetPremiumRedeemVaults = jest.fn(() => mockVaults);
// ray test touch >

const mockVaultsGetVaultsWithRedeemableTokens = jest.fn(() => mockVaults);

export {
  mockVaultsGet,
  mockVaultsGetPremiumRedeemVaults,
  mockVaultsGetVaultsWithIssuableTokens,
  mockVaultsGetVaultsWithRedeemableTokens
};
