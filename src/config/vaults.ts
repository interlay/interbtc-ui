import { getCorrespondingCollateralCurrencies } from '@interlay/interbtc-api';

const VAULT_COLLATERAL_TOKENS = getCorrespondingCollateralCurrencies(window.bridge.getGovernanceCurrency());

export { VAULT_COLLATERAL_TOKENS };
