import { createSubstrateAPI } from '@interlay/interbtc-api';
import { ApiPromise } from '@polkadot/api';

import { RELAYCHAIN_URL } from '../../constants';

const createRelayChainApi = async (): Promise<ApiPromise | undefined> => {
  if (!RELAYCHAIN_URL) return;

  let api;

  try {
    api = await createSubstrateAPI(RELAYCHAIN_URL);
  } catch (error) {
    console.log('[loadRelayChainApi] error.message => ', error.message);
  }

  return api;
};

export { createRelayChainApi };
