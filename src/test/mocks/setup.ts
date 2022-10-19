import './@interlay/interbtc-api';
import './@polkadot/api';
import './@polkadot/extension-dapp';
import './@polkadot/ui-keyring';
import './intersectionObserver';
import './fetch';
import './substrate';

import { createInterBtcApi } from '@interlay/interbtc-api';

// Pre-create API and assign to window to avoid waiting for substrate provider to be loaded before. 
// Does not need any parameters since lib instance is mocked.
const precreateApiInstance = async () => {
  window.bridge = await createInterBtcApi('');
}
precreateApiInstance();


if (!process.env?.REACT_APP_RELAY_CHAIN_NAME) {
  throw new Error('Please make sure you have created .env.test file with the necessary env variables');
}
