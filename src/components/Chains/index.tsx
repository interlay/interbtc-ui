
import * as React from 'react';

import ChainSelector, { ChainOption } from './ChainSelector';
import {
  RelayChainLogoIcon,
  BridgeParachainLogoIcon,
  RELAY_CHAIN_NAME,
  BRIDGE_PARACHAIN_NAME
} from 'config/relay-chains';

const CHAIN_OPTIONS: Array<ChainOption> = [
  {
    name: RELAY_CHAIN_NAME,
    icon: <RelayChainLogoIcon height={46} />
  },
  {
    name: BRIDGE_PARACHAIN_NAME,
    icon: <BridgeParachainLogoIcon height={46} />
  }
];

interface Props {
  label: string;
  callbackFunction?: (chain: ChainOption) => void;
}

const Chains = ({
  callbackFunction,
  label
}: Props): JSX.Element => {
  // Set initial value to first item in CHAIN_OPTIONS object
  const [selectedChain, setSelectedChain] = React.useState<ChainOption>(CHAIN_OPTIONS[0]);

  React.useEffect(() => {
    if (!callbackFunction) return;

    callbackFunction(selectedChain);
  }, [
    selectedChain,
    callbackFunction
  ]);

  return (
    <ChainSelector
      label={label}
      chainOptions={CHAIN_OPTIONS}
      selectedChain={selectedChain}
      onChange={setSelectedChain} />
  );
};

export type { ChainOption };
export default Chains;
