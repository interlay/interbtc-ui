import { ApiProvider, Bridge, ChainName } from '@interlay/bridge/build';
import { useEffect, useState } from 'react';
import { firstValueFrom } from 'rxjs';

import { XCM_ADAPTERS } from '@/config/relay-chains';
import { BITCOIN_NETWORK } from '@/constants';

const xcmProvider = new ApiProvider(BITCOIN_NETWORK);

const bridge = new Bridge({
  adapters: Object.values(XCM_ADAPTERS)
});

const useXcmBridge = (): { xcmProvider: any; xcmBridge: any } => {
  const [xcmBridge, setXcmBridge] = useState<any>();

  // TODO: This would be better in context
  useEffect(() => {
    const handleConnections = async () => {
      const chains = Object.keys(XCM_ADAPTERS) as ChainName[];

      // Check connection
      await firstValueFrom(xcmProvider.connectFromChain(chains, undefined));

      // Set Apis
      await Promise.all(chains.map((chain) => bridge.findAdapter(chain).setApi(xcmProvider.getApi(chain))));

      setXcmBridge(bridge);
    };

    handleConnections();
  }, []);

  return { xcmProvider, xcmBridge };
};

export { useXcmBridge };
