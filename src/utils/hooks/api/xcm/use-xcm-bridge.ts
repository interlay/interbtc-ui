import { ApiProvider, Bridge, ChainName } from '@interlay/bridge/build';
import { useEffect, useState } from 'react';
import { firstValueFrom } from 'rxjs';

import { XCM_ADAPTERS } from '@/config/relay-chains';
import { BITCOIN_NETWORK } from '@/constants';

const XCMBridge = new Bridge({
  adapters: Object.values(XCM_ADAPTERS)
});

// MEMO: BitcoinNetwork type is not available on XCM bridge
const XCMNetwork = BITCOIN_NETWORK === 'mainnet' ? 'mainnet' : 'testnet';

// TODO: This config needs to be pushed higher up the app.
// Not sure how this will look: something to decide when
// adding USDT support.
const getEndpoints = (chains: ChainName[]) => {
  switch (true) {
    case chains.includes('kusama'):
      return {
        kusama: [
          'wss://kusama-rpc.polkadot.io',
          'wss://kusama.api.onfinality.io/public-ws',
          'wss://kusama-rpc.dwellir.com'
        ],
        kintsugi: ['wss://api-kusama.interlay.io/parachain', 'wss://kintsugi.api.onfinality.io/public-ws']
      };
    case chains.includes('polkadot'):
      return {
        polkadot: ['wss://rpc.polkadot.io', 'wss://polkadot.api.onfinality.io/public-ws'],
        interlay: ['wss://api.interlay.io/parachain', 'wss://interlay.api.onfinality.io/public-ws']
      };

    default:
      return undefined;
  }
};

// const useXCMBridge = (): { XCMProvider: ApiProvider; XCMBridge: Bridge } => {
const useXCMBridge = (): { XCMProvider: ApiProvider; XCMBridge: Bridge } => {
  const [XCMProvider, setXCMProvider] = useState<any>();

  useEffect(() => {
    const createBridge = async () => {
      const XCMProvider = new ApiProvider(XCMNetwork);
      const chains = Object.keys(XCM_ADAPTERS) as ChainName[];

      // Check connection
      // TODO: Get rid of any casting - mismatch between ApiRx types
      await firstValueFrom(XCMProvider.connectFromChain(chains, getEndpoints(chains)) as any);

      // Set Apis
      await Promise.all(
        chains.map((chain: ChainName) =>
          // TODO: Get rid of any casting - mismatch between ApiRx types
          XCMBridge.findAdapter(chain).setApi(XCMProvider.getApi(chain) as any)
        )
      );

      setXCMProvider(XCMProvider);
    };

    if (!XCMProvider) {
      createBridge();
    }
  }, [XCMProvider]);

  return { XCMProvider, XCMBridge };
};

export { useXCMBridge };
