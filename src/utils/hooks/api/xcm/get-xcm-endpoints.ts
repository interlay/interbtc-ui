import { ChainName } from '@interlay/bridge';

type XCMEndpoints =
  | {
      [chain: string]: string[];
    }
  | undefined;

const getXCMEndpoints = (chains: ChainName[]): XCMEndpoints => {
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

export { getXCMEndpoints };
export type { XCMEndpoints };
