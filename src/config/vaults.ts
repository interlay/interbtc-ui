import { getCorrespondingCollateralCurrencies } from '@interlay/interbtc-api';

let VAULT_COLLATERAL_TOKENS = getCorrespondingCollateralCurrencies(window.bridge.getGovernanceCurrency());

// TODO: change this to hook - useGetVaultCollateralTokens
const loadForeign = async () => {
    const fa = await window.bridge.assetRegistry.getForeignAssets();
    VAULT_COLLATERAL_TOKENS = [...VAULT_COLLATERAL_TOKENS, ...fa]
}

loadForeign();

export { VAULT_COLLATERAL_TOKENS };
