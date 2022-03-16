
import * as React from 'react';

import ChainSelector, { ChainOption } from './ChainSelector';
import {
  RelayChainLogoIcon,
  BridgeParachainLogoIcon,
  RELAY_CHAIN_NAME,
  BRIDGE_PARACHAIN_NAME
} from 'config/relay-chains';
import { ChainType } from 'common/types/chains.types';

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

// TODO: This is a temporary workaround for supporting kusama -> kintsugi transfer only.
// This will be handled higher up when we support transferring in both directions and this
// code will be removed.
const RELAY_CHAIN_ONLY = [
  {
    type: ChainType.RelayChain,
    name: RELAY_CHAIN_NAME,
    icon: <RelayChainLogoIcon height={46} />
  }
];

const PARACHAIN_ONLY = [
  {
    type: ChainType.Parachain,
    name: BRIDGE_PARACHAIN_NAME,
    icon: <BridgeParachainLogoIcon height={46} />
  }
];

interface Props {
  label: string;
  callbackFunction?: (chain: ChainOption) => void;
  defaultChain: ChainType;
}

const getChain = (type: ChainType): ChainOption | undefined => CHAIN_OPTIONS.find(chain => chain.type === type);

const Chains = ({
  callbackFunction,
  label,
  defaultChain
}: Props): JSX.Element => {
  // If getChain returns undefined this will set the first item in the array as a fallback
  const [selectedChain, setSelectedChain] = React.useState<ChainOption>(getChain(defaultChain) || CHAIN_OPTIONS[0]);

  React.useEffect(() => {
    if (!callbackFunction) return;
    if (!selectedChain) return;

    callbackFunction(selectedChain);
  }, [
    selectedChain,
    callbackFunction
  ]);

  return (
    <div>
      {selectedChain && (
        <ChainSelector
          label={label}
          // TODO: remove this when support transferring from/to multiple chains
          chainOptions={defaultChain === ChainType.Parachain ? PARACHAIN_ONLY : RELAY_CHAIN_ONLY}
          selectedChain={selectedChain}
          onChange={setSelectedChain} />
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
