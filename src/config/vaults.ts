import { CollateralIdLiteral, CurrencyIdLiteral, GovernanceIdLiteral, WrappedIdLiteral } from '@interlay/interbtc-api';

import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';

let VAULT_COLLATERAL: Array<CollateralIdLiteral> = [];
let VAULT_WRAPPED: WrappedIdLiteral;
let VAULT_GOVERNANCE: GovernanceIdLiteral;

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

export { VAULT_COLLATERAL, VAULT_GOVERNANCE, VAULT_WRAPPED };
