import { SubmittableExtrinsic } from '@polkadot/api/types';
import { AccountId } from '@polkadot/types/interfaces';

const proxyExtrinsic = (
  proxyAccount: AccountId,
  extrinsic: SubmittableExtrinsic<'promise'>
): SubmittableExtrinsic<'promise'> => window.bridge.api.tx.proxy.proxy(proxyAccount, 'Any', extrinsic);

export { proxyExtrinsic };
