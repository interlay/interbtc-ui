import { Issue, newMonetaryAmount } from '@interlay/interbtc-api';

import { RELAY_CHAIN_NATIVE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';

import { MOCK_PRIMITIVES } from './interbtc-primitives';

const mockIssue: Issue = {
  id: 'ac30ffed98687e71698733eafa6d90c25d03dfbbfdfa1a7cae5f0c2a633b1a7c',
  creationBlock: 298883,
  vaultWrappedAddress: 'tb1q85trl4jq0h6zsfce943tmmz52ptvw5uaxmq9c4',
  vaultId: {
    accountId: 'wdCfqzWZCA6rnNzTPLsaANZ9CKKbFuFJNGMGYGP9HE5jJg9Rk',
    currencies: {
      collateral: MOCK_PRIMITIVES.RELAY_CHAIN_NATIVE_TOKEN,
      wrapped: MOCK_PRIMITIVES.WRAPPED_TOKEN
    }
  },
  userParachainAddress: 'wdCfqzWZCA6rnNzTPLsaANZ9CKKbFuFJNGMGYGP9HE5jJg9Rk',
  vaultWalletPubkey: '0x0248bf0a78ec32f29acdc1bdd5fb2f4f338b962560626eeb906f3d02c06a331e01',
  bridgeFee: newMonetaryAmount(0, WRAPPED_TOKEN),
  wrappedAmount: newMonetaryAmount(1, WRAPPED_TOKEN, true),
  griefingCollateral: newMonetaryAmount(1, RELAY_CHAIN_NATIVE_TOKEN, true),
  status: 4,
  period: 3600
};

export { mockIssue };
