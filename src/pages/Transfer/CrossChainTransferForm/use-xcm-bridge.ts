import { ApiProvider } from '@interlay/bridge/build';

import { XCM_BRIDGE_CONFIG } from '@/config/relay-chains';
import { BITCOIN_NETWORK } from '@/constants';

const provider = new ApiProvider(BITCOIN_NETWORK) as any;
console.log(BITCOIN_NETWORK);

const useXcmBridge = (): void => {
  console.log(provider, XCM_BRIDGE_CONFIG);
};

export { useXcmBridge };
