
// ray test touch <<
// This component will simply add utility functions to your developer console.
import { Keyring } from '@polkadot/ui-keyring/Keyring';
import { ApiPromise } from '@polkadot/api';

import { useSubstrate } from '../../';
import {
  ApiStatus,
  KeyringStatus
} from '../../substrate-context';

declare global {
  interface Window {
    keyring: Keyring | null;
    api: ApiPromise | null;
    // TODO: should type properly
    util: any;
    utilCrypto: any;
  }
}

const DeveloperConsole = (): null => {
  const {
    state: {
      api,
      apiStatus,
      keyring,
      keyringStatus
    }
  } = useSubstrate();

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
// ray test touch >>
