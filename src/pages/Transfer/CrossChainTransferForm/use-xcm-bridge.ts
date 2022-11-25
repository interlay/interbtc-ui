import { ApiProvider, Bridge } from '@interlay/bridge/build';
import { useEffect } from 'react';
import { firstValueFrom } from 'rxjs';

import { XCM_ADAPTERS } from '@/config/relay-chains';
import { BITCOIN_NETWORK } from '@/constants';

const provider = new ApiProvider(BITCOIN_NETWORK);
const testAccount = 'a3btHGrr9Zr51KNDu4nx4QhnQYbAtPMEE7D7j6ntRn5W6K9Yq';

const bridge = new Bridge({
  adapters: Object.values(XCM_ADAPTERS)
});

const useXcmBridge = (): void => {
  useEffect(() => {
    const handleConnections = async () => {
      await firstValueFrom(provider.connectFromChain(['interlay', 'polkadot'], undefined));
      await bridge.findAdapter('interlay').setApi(provider.getApi('interlay'));
      await bridge.findAdapter('polkadot').setApi(provider.getApi('polkadot'));

      const interlayBalance = await firstValueFrom(
        bridge.findAdapter('interlay').subscribeTokenBalance('DOT', testAccount)
      );

      const polkadotBalance = await firstValueFrom(
        bridge.findAdapter('polkadot').subscribeTokenBalance('DOT', testAccount)
      );

      console.log('interlayBalance.free.toString', interlayBalance.free.toString());
      console.log('polkadotBalance.free.toString', polkadotBalance.free.toString());
    };

    handleConnections();
  }, []);
};

export { useXcmBridge };
