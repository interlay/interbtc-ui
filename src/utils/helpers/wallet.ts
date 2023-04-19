import { web3FromSource } from '@polkadot/extension-dapp';
import { SignerResult } from '@polkadot/types/types';
import { stringToHex } from '@polkadot/util';

import { KeyringPair } from '@/lib/substrate';

const signMessage = async (account: KeyringPair, message: string): Promise<SignerResult | undefined> => {
  const injector = await web3FromSource(account.meta.source as any);
  const signRaw = injector?.signer?.signRaw;

  if (!signRaw) return;
  // after making sure that signRaw is defined
  // we can use it to sign our message
  return signRaw({
    address: account.address,
    data: stringToHex(message),
    type: 'bytes'
  });
};

export { signMessage };
