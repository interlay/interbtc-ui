import '@testing-library/jest-dom';

import { CollateralCurrencyExt, CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { BitcoinAmount } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';

import { RELAY_CHAIN_NATIVE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';

const MOCK_COLLATERAL_AMOUNT = '1000000000000';
// TODO: Extend with all the data needed for Vaults page.
const defaultVaultWithIssuableTokens = (_accountId: AccountId, collateralCurrency: CollateralCurrencyExt) => ({
  backingCollateral: newMonetaryAmount(MOCK_COLLATERAL_AMOUNT, collateralCurrency)
});

const mockVaultsGet = jest.fn((accountId, currency) => defaultVaultWithIssuableTokens(accountId, currency));

const mockNewVaultId = (vaultAddress: string, collateralToken: CurrencyExt) => ({
  accountId: vaultAddress,
  currencies: {
    collateral: collateralToken,
    wrapped: WRAPPED_TOKEN
  }
});

const MOCK_VAULT_ADDRESS = '5GQoBrhX3mfnmKnw2qz2vGvHG8yvf6xT15gGM54865g6qEfE';

const MOCK_COLLATERAL_TOKEN = RELAY_CHAIN_NATIVE_TOKEN;

const MOCK_BITCOIN_AMOUNT = 100;

// ray test touch <
const mockVaults = new Map().set(
  mockNewVaultId(MOCK_VAULT_ADDRESS, MOCK_COLLATERAL_TOKEN),
  new BitcoinAmount(MOCK_BITCOIN_AMOUNT)
);
// ray test touch >

const mockVaultsGetVaultsWithIssuableTokens = jest.fn(() => mockVaults);

const mockVaultsGetPremiumRedeemVaults = jest.fn(() => mockVaults);

// ray test touch <
const mockVaultsGetVaultsWithRedeemableTokens = jest.fn(() => mockVaults);
// ray test touch >

export {
  mockVaultsGet,
  mockVaultsGetPremiumRedeemVaults,
  mockVaultsGetVaultsWithIssuableTokens,
  mockVaultsGetVaultsWithRedeemableTokens
};
