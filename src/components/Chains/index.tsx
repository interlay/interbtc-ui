
import * as React from 'react';

import ChainSelector, { ChainOption } from './ChainSelector';
import {
  RelayChainLogoIcon,
  BridgeParachainLogoIcon,
  RELAY_CHAIN_NAME,
  BRIDGE_PARACHAIN_NAME
} from 'config/relay-chains';
import { ChainType } from 'types/chains';

const CHAIN_OPTIONS: Array<ChainOption> = [
  {
    type: ChainType.Relaychain,
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
  callbackFunction?: (chain: ChainOption) => void;
  defaultChain: ChainType;
}

const getChain = (type: ChainType) => CHAIN_OPTIONS.find(chain => chain.type === type);

const Chains = ({
  callbackFunction,
  label,
  defaultChain
}: Props): JSX.Element => {
  const [selectedChain, setSelectedChain] = React.useState<ChainOption | undefined>(getChain(defaultChain));

  React.useEffect(() => {
    if (!callbackFunction) return;
    if (!selectedChain) return;

    callbackFunction(selectedChain);
  }, [
    selectedChain,
    callbackFunction
  ]);

  return (
    <>
      {selectedChain && (
        <ChainSelector
          label={label}
          chainOptions={CHAIN_OPTIONS}
          selectedChain={selectedChain}
          onChange={setSelectedChain} />
      )}
    </>
  );
};

export type { ChainOption };
export default Chains;
