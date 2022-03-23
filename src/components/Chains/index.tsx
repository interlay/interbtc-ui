
import * as React from 'react';

import ChainSelector, { ChainOption } from './ChainSelector';
import {
  RelayChainLogoIcon,
  BridgeParachainLogoIcon,
  RELAY_CHAIN_NAME,
  BRIDGE_PARACHAIN_NAME
} from 'config/relay-chains';
import { ChainType } from 'types/chains.types';

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
  onChange: (chain: ChainOption) => void;
  selectedChain: ChainType | undefined;
}

const getChain = (type: ChainType): ChainOption | undefined => CHAIN_OPTIONS.find(chain => chain.type === type);

const Chains = ({
  onChange,
  label,
  selectedChain
}: Props): JSX.Element => {
  return (
    <div>
      {selectedChain && (
        <ChainSelector
          label={label}
          chainOptions={CHAIN_OPTIONS}
          selectedChain={getChain(selectedChain)}
          onChange={onChange} />
      )}
    </div>
  );
};

export type { ChainOption };

export {
  CHAIN_OPTIONS,
  getChain
};

export default Chains;
