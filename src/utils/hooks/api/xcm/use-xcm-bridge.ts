import { ApiProvider, Bridge, ChainName } from '@interlay/bridge/build';
import { useEffect, useState } from 'react';
import { firstValueFrom } from 'rxjs';

import { XCM_ADAPTERS } from '@/config/relay-chains';
import { BITCOIN_NETWORK } from '@/constants';

const xcmBridge = new Bridge({
  adapters: Object.values(XCM_ADAPTERS)
});

// MEMO: BitcoinNetwork type is not available on xcm bridge
const xcmNetwork = BITCOIN_NETWORK === 'mainnet' ? 'mainnet' : 'testnet';

const useXcmBridge = (): { xcmProvider: any; xcmBridge: any } => {
  const [xcmProvider, setXcmProvider] = useState<any>();

  useEffect(() => {
    const createBridge = async () => {
      const xcmProvider = new ApiProvider(xcmNetwork) as any;
      const chains = Object.keys(XCM_ADAPTERS) as ChainName[];

      // Check connection
      await firstValueFrom(xcmProvider.connectFromChain(chains, undefined));

      // Set Apis
      await Promise.all(chains.map((chain) => xcmBridge.findAdapter(chain).setApi(xcmProvider.getApi(chain))));

      setXcmProvider(xcmProvider);
    };

    createBridge();
  }, []);

  return { xcmProvider, xcmBridge };
};

export { useXcmBridge };
