import { CurrencyIdLiteral } from '@interlay/interbtc-api';

import { POLKADOT, KUSAMA } from 'utils/constants/relay-chain-names';

let VAULT_COLLATERAL: Array<CurrencyIdLiteral> = [];
let VAULT_WRAPPED: CurrencyIdLiteral;

switch (process.env.REACT_APP_RELAY_CHAIN_NAME) {
  case POLKADOT: {
    VAULT_COLLATERAL = [CurrencyIdLiteral.DOT, CurrencyIdLiteral.INTR];
    VAULT_WRAPPED = CurrencyIdLiteral.INTERBTC;
    break;
  }
  case KUSAMA: {
    VAULT_COLLATERAL = [CurrencyIdLiteral.KSM, CurrencyIdLiteral.KINT];
    VAULT_WRAPPED = CurrencyIdLiteral.KBTC;
    break;
  }
  default: {
    VAULT_COLLATERAL = [];
  }
}

export { VAULT_COLLATERAL, VAULT_WRAPPED };
