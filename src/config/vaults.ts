import { CollateralIdLiteral, CurrencyIdLiteral } from '@interlay/interbtc-api';

import { POLKADOT, KUSAMA } from 'utils/constants/relay-chain-names';

let VAULT_COLLATERAL: Array<CollateralIdLiteral> = [];
let VAULT_WRAPPED: CurrencyIdLiteral;
let VAULT_GOVERNANCE: CurrencyIdLiteral;

switch (process.env.REACT_APP_RELAY_CHAIN_NAME) {
  case POLKADOT: {
    VAULT_COLLATERAL = [CurrencyIdLiteral.DOT, CurrencyIdLiteral.INTR];
    VAULT_WRAPPED = CurrencyIdLiteral.INTERBTC;
    VAULT_GOVERNANCE = CurrencyIdLiteral.INTR;
    break;
  }
  case KUSAMA: {
    VAULT_COLLATERAL = [CurrencyIdLiteral.KSM, CurrencyIdLiteral.KINT];
    VAULT_WRAPPED = CurrencyIdLiteral.KBTC;
    VAULT_GOVERNANCE = CurrencyIdLiteral.KINT;
    break;
  }
  default: {
    VAULT_COLLATERAL = [];
  }
}

export { VAULT_COLLATERAL, VAULT_WRAPPED, VAULT_GOVERNANCE };
