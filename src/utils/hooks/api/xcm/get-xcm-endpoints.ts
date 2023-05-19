import { ChainName } from '@interlay/bridge';

type XCMEndpointsRecord = Record<ChainName, string[]>;

const XCMEndpoints: XCMEndpointsRecord = {
  acala: ['wss://acala-rpc-0.aca-api.network', 'wss://acala-rpc.dwellir.com'],
  astar: ['wss://rpc.astar.network', 'wss://astar-rpc.dwellir.com'],
  bifrost: ['wss://bifrost-rpc.dwellir.com'],
  heiko: ['wss://heiko-rpc.parallel.fi'],
  hydra: ['wss://rpc.hydradx.cloud', 'wss://hydradx-rpc.dwellir.com'],
  interlay: ['wss://api.interlay.io/parachain'],
  karura: ['wss://karura-rpc-0.aca-api.network', 'wss://karura-rpc.dwellir.com'],
  kintsugi: ['wss://api-kusama.interlay.io/parachain'],
  kusama: ['wss://kusama-rpc.polkadot.io', 'wss://kusama-rpc.dwellir.com'],
  parallel: ['wss://rpc.parallel.fi'],
  polkadot: ['wss://rpc.polkadot.io', 'wss://polkadot-rpc.dwellir.com'],
  statemine: ['wss://statemine-rpc.polkadot.io', 'wss://statemine-rpc.dwellir.com'],
  statemint: ['wss://statemint-rpc.polkadot.io', 'wss://statemint-rpc.dwellir.com']
};

export { XCMEndpoints };
export type { XCMEndpointsRecord };
