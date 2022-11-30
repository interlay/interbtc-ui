import * as React from 'react';

import {
  BRIDGE_PARACHAIN_NAME,
  BridgeParachainLogoIcon,
  RELAY_CHAIN_NAME,
  RelayChainLogoIcon
} from '@/config/relay-chains';
import { ChainType } from '@/types/chains.types';

import ChainSelector, { ChainOption } from './ChainSelector';

const CHAIN_OPTIONS: Array<ChainOption> = [
  {
    type: ChainType.RelayChain,
    name: RELAY_CHAIN_NAME,
    icon: <RelayChainLogoIcon height={46} />
  },
  {
    type: ChainType.Parachain,
    name: BRIDGE_PARACHAIN_NAME,
    icon: <BridgeParachainLogoIcon height={46} />
  }
];

interface Props {
  label: string;
  chainOptions?: Array<ChainOption>;
  onChange: (chain: ChainOption) => void;
  selectedChain: ChainOption | undefined;
}

const Chains = ({ onChange, chainOptions = CHAIN_OPTIONS, label, selectedChain }: Props): JSX.Element => {
  return (
    <div>
      {selectedChain && (
        <ChainSelector label={label} chainOptions={chainOptions} selectedChain={selectedChain} onChange={onChange} />
      )}
    </div>
  );
};

export type { ChainOption };

export { CHAIN_OPTIONS };

export default Chains;
