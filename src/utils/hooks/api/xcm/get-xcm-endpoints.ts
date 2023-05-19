import { ChainName } from '@interlay/bridge';

type XCMEndpointsRecord = Record<ChainName, string[]>;

const XCMEndpoints: XCMEndpointsRecord = {
  acala: ['wss://acala-rpc-0.aca-api.network', 'wss://acala-rpc.dwellir.com'],
  astar: [],
  bifrost: [],
  heiko: [],
  hydra: [],
  interlay: ['wss://api.interlay.io/parachain', 'wss://interlay.api.onfinality.io/public-ws'],
  karura: [],
  kintsugi: ['wss://api-kusama.interlay.io/parachain', 'wss://kintsugi.api.onfinality.io/public-ws'],
  kusama: ['wss://kusama-rpc.polkadot.io', 'wss://kusama.api.onfinality.io/public-ws'],
  parallel: [],
  polkadot: ['wss://rpc.polkadot.io', 'wss://polkadot.api.onfinality.io/public-ws'],
  statemine: ['wss://statemine-rpc.polkadot.io', 'wss://statemine.api.onfinality.io/public-ws'],
  statemint: ['wss://statemint-rpc.polkadot.io', 'wss://statemint.api.onfinality.io/public-ws']
};

export { XCMEndpoints };
export type { XCMEndpointsRecord };
