// This component will simply add utility functions to your developer console.
import { ApiPromise } from '@polkadot/api';
import { Keyring } from '@polkadot/ui-keyring/Keyring';

import { useSubstrateState } from '../../';
import { ApiStatus, KeyringStatus } from '../../substrate-context';

declare global {
  interface Window {
    keyring: Keyring | undefined;
    api: ApiPromise | undefined;
    // TODO: should type properly
    util: any;
    utilCrypto: any;
  }
}

// TODO: do code-splitting
const DeveloperConsole = (): null => {
  const { api, apiStatus, keyring, keyringStatus } = useSubstrateState();

  if (apiStatus === ApiStatus.Ready) {
    window.api = api;
  }
  if (keyringStatus === KeyringStatus.Ready) {
    window.keyring = keyring;
  }
  window.util = require('@polkadot/util');
  window.utilCrypto = require('@polkadot/util-crypto');

  return null;
};

export default DeveloperConsole;
