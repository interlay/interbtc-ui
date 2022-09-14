import '@testing-library/jest-dom';

import { CollateralCurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { AccountId } from '@polkadot/types/interfaces';

const DEFAULT_COLLATERAL_AMOUNT = '1000000000000';
// TODO: Extend with all the data needed for Vaults page.
const DEFAULT_VAULT_WITH_ISSUABLE_TOKENS = (_accountId: AccountId, collateralCurrency: CollateralCurrencyExt) => ({
  backingCollateral: newMonetaryAmount(DEFAULT_COLLATERAL_AMOUNT, collateralCurrency)
});

const mockVaultsGet = jest.fn((accountId, currency) => DEFAULT_VAULT_WITH_ISSUABLE_TOKENS(accountId, currency));
const mockVaultsGetVaultsWithIssuableTokens = jest.fn(() => []);

export { mockVaultsGet, mockVaultsGetVaultsWithIssuableTokens };
