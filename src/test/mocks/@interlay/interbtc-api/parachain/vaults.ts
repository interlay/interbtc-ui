import '@testing-library/jest-dom';

import { CollateralCurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { AccountId } from '@polkadot/types/interfaces';

const DEFAULT_COLLATERAL_AMOUNT = '1000000000000';
// TODO: Extend with all the data needed for Vaults page.
const DEFAULT_VAULT_WITH_ISSUABLE_TOKENS = (_accountId: AccountId, collateralCurrency: CollateralCurrencyExt) => ({
  backingCollateral: newMonetaryAmount(DEFAULT_COLLATERAL_AMOUNT, collateralCurrency)
});

const mockVaultsGet = jest.fn((accountId, currency) => DEFAULT_VAULT_WITH_ISSUABLE_TOKENS(accountId, currency));
// ray test touch <
// const vault1Id = newVaultId(mockInterBtcApi.api as ApiPromise, '5GQoBrhX3mfnmKnw2qz2vGvHG8yvf6xT15gGM54865g6qEfE', RELAY_CHAIN_NATIVE_TOKEN, KBtc);
// const vaultsWithIssuableTokens = new Map().set(vault1Id, new BitcoinAmount(10));
// const mockVaultsGetVaultsWithIssuableTokens = jest.fn(() => vaultsWithIssuableTokens);
const mockVaultsGetVaultsWithIssuableTokens = jest.fn(() => []);
// ray test touch >

export { mockVaultsGet, mockVaultsGetVaultsWithIssuableTokens };
