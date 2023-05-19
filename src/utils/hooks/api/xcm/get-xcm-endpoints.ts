import { ChainName } from '@interlay/bridge';

type XCMEndpointsRecord = Record<ChainName, string[]>;

const XCMEndpoints: XCMEndpointsRecord = {
  acala: ['wss://acala-rpc-0.aca-api.network', 'wss://acala-rpc.dwellir.com'],
  astar: ['wss://rpc.astar.network', 'wss://astar-rpc.dwellir.com'],
  bifrost: ['wss://bifrost-polkadot.api.onfinality.io/public-ws', 'wss://hk.p.bifrost-rpc.liebi.com/ws'],
  heiko: ['wss://heiko-rpc.parallel.fi', 'wss://parallel-heiko.api.onfinality.io/public-ws'],
  hydra: ['wss://hydradx-rpc.dwellir.com', 'wss://hydradx.api.onfinality.io/public-ws'],
  interlay: ['wss://api.interlay.io/parachain', 'wss://interlay.api.onfinality.io/public-ws'],
  karura: ['wss://karura-rpc-0.aca-api.network', 'wss://karura-rpc.dwellir.com'],
  kintsugi: ['wss://api-kusama.interlay.io/parachain', 'wss://kintsugi.api.onfinality.io/public-ws'],
  kusama: ['wss://kusama-rpc.polkadot.io', 'wss://kusama.api.onfinality.io/public-ws'],
  parallel: ['wss://rpc.parallel.fi'],
  polkadot: ['wss://rpc.polkadot.io', 'wss://polkadot.api.onfinality.io/public-ws'],
  statemine: ['wss://statemine-rpc.polkadot.io', 'wss://statemine.api.onfinality.io/public-ws'],
  statemint: ['wss://statemint-rpc.polkadot.io', 'wss://statemint.api.onfinality.io/public-ws']
};

export { XCMEndpoints };
export type { XCMEndpointsRecord };
