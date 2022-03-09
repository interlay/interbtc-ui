
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

const Chains = (): JSX.Element => {
  // Set initial value to first item in CHAIN_OPTIONS object
  const [selectedChain, setselectedChain] = React.useState<ChainOption>(CHAIN_OPTIONS[0]);

  return (
    <ChainSelector
      chainOptions={CHAIN_OPTIONS}
      selectedChain={selectedChain}
      onChange={setselectedChain} />
  );
};

export type { ChainOption };
export default Chains;
