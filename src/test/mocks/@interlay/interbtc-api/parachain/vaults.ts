import '@testing-library/jest-dom';

import {
  CollateralCurrencyExt,
  // ray test touch <
  getAPITypes,
  // ray test touch >
  newMonetaryAmount
} from '@interlay/interbtc-api';
// ray test touch <
import { TypeRegistry } from '@polkadot/types';
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
const registry = new TypeRegistry();
registry.register(getAPITypes());

const collateralCurrencyId = registry.createType('InterbtcPrimitivesCurrencyId', {
  token: RELAY_CHAIN_NATIVE_TOKEN.ticker
});
const wrappedCurrencyId = registry.createType('InterbtcPrimitivesCurrencyId', {
  token: WRAPPED_TOKEN.ticker
});

const vaultAccountId = registry.createType('AccountId', '5GQoBrhX3mfnmKnw2qz2vGvHG8yvf6xT15gGM54865g6qEfE');
const vaultCurrencyPair = registry.createType('InterbtcPrimitivesVaultCurrencyPair', {
  collateral: collateralCurrencyId,
  wrapped: wrappedCurrencyId
});

const vaultId = registry.createType('InterbtcPrimitivesVaultId', {
  account_id: vaultAccountId,
  currencies: vaultCurrencyPair
});

console.log('ray : ***** vaultId => ', vaultId);

const mockVaultsGetVaultsWithIssuableTokens = jest.fn(() => []);
// ray test touch >

export { mockVaultsGet, mockVaultsGetVaultsWithIssuableTokens };
