import { createSubstrateAPI } from '@interlay/interbtc-api';

import { RELAY_CHAIN_URL } from '@/constants';

import { RelayChainApi } from './';

const createRelayChainApi = async (): Promise<RelayChainApi | undefined> => {
  // Return api as undefined if relay chain isn't set. This should never happen
  // as XCM features should be suppressed if the relaychain is undefined.
  if (!RELAY_CHAIN_URL) {
    console.log('Unable to create relayChain API as RELAYCHAIN_URL is undefined');
    return undefined;
  }

  try {
    return await createSubstrateAPI(RELAY_CHAIN_URL);
  } catch (error) {
    console.log('[loadRelayChainApi] error.message => ', error.message);
  }
};

export { createRelayChainApi };
