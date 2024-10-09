import { ChainName } from '@interlay/bridge';

type XCMEndpointsRecord = Record<ChainName, string[]>;

const XCMEndpoints: XCMEndpointsRecord = {
  acala: ['wss://acala-rpc-1.aca-api.network', 'wss://acala-rpc-3.aca-api.network/ws', 'wss://acala-rpc.dwellir.com'],
  astar: ['wss://rpc.astar.network', 'wss://astar-rpc.dwellir.com'],
  bifrost: ['wss://bifrost-rpc.dwellir.com', 'wss://us.bifrost-rpc.liebi.com/ws', 'wss://bifrost-rpc.liebi.com/ws'],
  bifrost_polkadot: [
    'wss://hk.p.bifrost-rpc.liebi.com/ws',
    'wss://bifrost-polkadot-rpc.dwellir.com',
    'wss://eu.bifrost-polkadot-rpc.liebi.com/ws'
  ],
  heiko: ['wss://heiko-rpc.parallel.fi'],
  hydra: ['wss://rpc.hydradx.cloud', 'wss://hydradx-rpc.dwellir.com'],
  interlay: ['wss://api.interlay.io/parachain'],
  karura: [
    'wss://karura-rpc-0.aca-api.network',
    'wss://karura-rpc-1.aca-api.network',
    'wss://karura-rpc-2.aca-api.network/ws',
    'wss://karura-rpc-3.aca-api.network/ws'
  ],
  kintsugi: ['wss://api-kusama.interlay.io/parachain'],
  kusama: ['wss://kusama-rpc.dwellir.com', 'wss://rpc.ibp.network/kusama', 'wss://rpc-kusama.luckyfriday.io'],
  parallel: ['wss://polkadot-parallel-rpc.parallel.fi', 'wss://parallel-rpc.dwellir.com'],
  phala: ['wss://api.phala.network/ws', 'wss://phala-rpc.dwellir.com'],
  polkadot: ['wss://polkadot-rpc.dwellir.com', 'wss://rpc.ibp.network/polkadot', 'wss://rpc-polkadot.luckyfriday.io'],
  statemine: [
    'wss://kusama-asset-hub-rpc.polkadot.io',
    'wss://asset-hub-kusama-rpc.dwellir.com',
    'wss://statemine-rpc-tn.dwellir.com'
  ],
  statemint: [
    'wss://polkadot-asset-hub-rpc.polkadot.io',
    'wss://asset-hub-polkadot-rpc.dwellir.com',
    'wss://statemint-rpc-tn.dwellir.com'
  ]
};

export { XCMEndpoints };
export type { XCMEndpointsRecord };
