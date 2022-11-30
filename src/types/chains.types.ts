enum ChainType {
  Parachain = 'parachain',
  RelayChain = 'relayChain'
}

type XcmChains = 'polkadot' | 'interlay';

export type { XcmChains };
export { ChainType };
