import { CurrencyIdLiteral } from '@interlay/interbtc-api';

import { KUSAMA,POLKADOT } from '@/utils/constants/relay-chain-names';

let VAULT_COLLATERAL: Array<CurrencyIdLiteral> = [];

switch (process.env.REACT_APP_RELAY_CHAIN_NAME) {
  case POLKADOT: {
    VAULT_COLLATERAL = [];
    break;
  }
  case KUSAMA: {
    VAULT_COLLATERAL = [CurrencyIdLiteral.KSM];
    break;
  }
  default: {
    VAULT_COLLATERAL = [];
  }
}

export { VAULT_COLLATERAL };
