import '@testing-library/jest-dom';

import { CollateralCurrencyExt, CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { BitcoinAmount } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';

import { RELAY_CHAIN_NATIVE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';

const MOCK_COLLATERAL_AMOUNT = '1000000000000';

const mockVaultsGet = jest.fn((_accountId: AccountId, collateralCurrency: CollateralCurrencyExt) => ({
  backingCollateral: newMonetaryAmount(MOCK_COLLATERAL_AMOUNT, collateralCurrency)
}));

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

const mockVaultsGetVaultsWithIssuableTokens = jest.fn(() =>
  new Map().set(mockNewVaultId(MOCK_VAULT_ADDRESS, MOCK_COLLATERAL_TOKEN), new BitcoinAmount(MOCK_BITCOIN_AMOUNT))
);

const mockVaultsGetPremiumRedeemVaults = jest.fn(() =>
  new Map().set(mockNewVaultId(MOCK_VAULT_ADDRESS, MOCK_COLLATERAL_TOKEN), new BitcoinAmount(MOCK_BITCOIN_AMOUNT))
);

const mockVaultsGetVaultsWithRedeemableTokens = jest.fn(() =>
  new Map().set(mockNewVaultId(MOCK_VAULT_ADDRESS, MOCK_COLLATERAL_TOKEN), new BitcoinAmount(MOCK_BITCOIN_AMOUNT))
);

export {
  mockVaultsGet,
  mockVaultsGetPremiumRedeemVaults,
  mockVaultsGetVaultsWithIssuableTokens,
  mockVaultsGetVaultsWithRedeemableTokens
};
