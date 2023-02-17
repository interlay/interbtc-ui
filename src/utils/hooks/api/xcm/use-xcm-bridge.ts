import { ApiProvider, Bridge, ChainName } from '@interlay/bridge/build';
import { useEffect, useState } from 'react';
import { firstValueFrom } from 'rxjs';

import { XCM_ADAPTERS } from '@/config/relay-chains';
import { BITCOIN_NETWORK } from '@/constants';
import { Chains } from '@/pages/Transfer/CrossChainTransferForm/components/ChainSelect';

const XCMBridge = new Bridge({
  adapters: Object.values(XCM_ADAPTERS)
});

// MEMO: BitcoinNetwork type is not available on XCM bridge
const XCMNetwork = BITCOIN_NETWORK === 'mainnet' ? 'mainnet' : 'testnet';

const getDestinationChains = (chain: ChainName): Chains => XCMBridge.router.getDestinationChains(chain as any);

const getAvailableTokens = (from: ChainName, to: ChainName): any => XCMBridge.router.getAvailableTokens({ from, to });

// TODO: This config needs to be pushed higher up the app.
// Not sure how this will look: something to decide when
// adding USDT support.
const getEndpoints = (chains: ChainName[]) => {
  switch (true) {
    case chains.includes('kusama'):
      return {
        kusama: ['wss://kusama-rpc.polkadot.io', 'wss://kusama.api.onfinality.io/public-ws'],
        kintsugi: ['wss://api-kusama.interlay.io/parachain', 'wss://kintsugi.api.onfinality.io/public-ws'],
        statemine: ['wss://statemine-rpc.polkadot.io', 'wss://statemine.api.onfinality.io/public-ws']
      };
    case chains.includes('polkadot'):
      return {
        polkadot: ['wss://rpc.polkadot.io', 'wss://polkadot.api.onfinality.io/public-ws'],
        interlay: ['wss://api.interlay.io/parachain', 'wss://interlay.api.onfinality.io/public-ws'],
        statemint: ['wss://statemint-rpc.polkadot.io', 'wss://statemint.api.onfinality.io/public-ws']
      };

    default:
      return undefined;
  }
};

// const useXCMBridge = (): { XCMProvider: ApiProvider; XCMBridge: Bridge } => {
const useXCMBridge = (): {
  XCMProvider: ApiProvider;
  XCMBridge: Bridge;
  availableChains: Chains;
  getDestinationChains: (chain: ChainName) => Chains;
  getAvailableTokens: (from: ChainName, to: ChainName) => any;
} => {
  const [XCMProvider, setXCMProvider] = useState<any>();
  const [availableChains, setAvailableChains] = useState<Chains>([]);

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

      const originatingChains = XCMBridge.adapters.map((adapter: any) => {
        return {
          display: adapter.chain.display,
          id: adapter.chain.id
        };
      });

      setAvailableChains(originatingChains);
      setXCMProvider(XCMProvider);
    };

    if (!XCMProvider) {
      createBridge();
    }
  }, [XCMProvider]);

  return { XCMProvider, XCMBridge, availableChains, getDestinationChains, getAvailableTokens };
};

export { useXCMBridge };
