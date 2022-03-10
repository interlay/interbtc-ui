import { createSubstrateAPI } from '@interlay/interbtc-api';
import { ApiPromise } from '@polkadot/api';

import { RELAYCHAIN_URL } from '../../constants';

const createRelayChainApi = async (): Promise<ApiPromise | undefined> => {
  // Return api as undefined if relay chain isn't set. This should never happen
  // as XCM features should be suppressed if the relaychain is undefined.
  if (!RELAYCHAIN_URL) {
    console.log('Unable to create relayChain API as RELAYCHAIN_URL is undefined');
    return undefined;
  }

  try {
   return await createSubstrateAPI(RELAYCHAIN_URL);
  } catch (error) {
    console.log('[loadRelayChainApi] error.message => ', error.message);
  }
};

export { createRelayChainApi };
