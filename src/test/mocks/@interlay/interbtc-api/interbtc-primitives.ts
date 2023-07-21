import { InterbtcPrimitivesVaultId } from '@interlay/interbtc-api';

import { GOVERNANCE_TOKEN, RELAY_CHAIN_NATIVE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';

const MOCK_PRIMITIVES: Record<
  'RELAY_CHAIN_NATIVE_TOKEN' | 'GOVERNANCE_TOKEN' | 'WRAPPED_TOKEN',
  InterbtcPrimitivesVaultId
> = {
  RELAY_CHAIN_NATIVE_TOKEN: {
    type: 'Token',
    // token:
    isToken: true,
    asToken: {
      isDot: true
      // isKsm: true
    }
  },
  GOVERNANCE_TOKEN: {
    type: 'Token',
    isToken: true,
    asToken: {
      // isKint: true,
      isIntr: true
    }
  },
  WRAPPED_TOKEN: {
    type: 'Token',
    isToken: true,
    asToken: {
      isIbtc: true
      // isKbtc: true
    }
  }
};

const mockTokenSymbolToCurrencyFn = (type: any) => {
  if (type.asToken.isDot || type.asToken.isKsm) {
    return RELAY_CHAIN_NATIVE_TOKEN;
  }

  if (type.asToken.isIntr || type.asToken.isKint) {
    return GOVERNANCE_TOKEN;
  }

  if (type.asToken.isIbtc || type.asToken.isKbtc) {
    return WRAPPED_TOKEN;
  }
};

export { MOCK_PRIMITIVES, mockTokenSymbolToCurrencyFn };
