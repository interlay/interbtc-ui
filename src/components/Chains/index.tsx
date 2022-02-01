
import * as React from 'react';
import ChainSelector, { ChainOption } from './ChainSelector';

import {
  WrappedTokenLogoIcon,
  CollateralTokenLogoIcon,
  RELAY_CHAIN_NAME,
  BRIDGE_PARACHAIN_NAME
} from 'config/relay-chains';

const CHAIN_OPTIONS: Array<ChainOption> = [
  {
    name: RELAY_CHAIN_NAME,
    icon: <CollateralTokenLogoIcon height={46} />
  },
  {
    name: BRIDGE_PARACHAIN_NAME,
    icon: <WrappedTokenLogoIcon height={46} />
  }
];

const getChainOption = (name: string) => CHAIN_OPTIONS?.find((chain: ChainOption) => chain.name === name);

const Chains = (): JSX.Element => {
  const [currentChain, setCurrentChain] = React.useState<ChainOption | undefined>(undefined);

  const handleUpdateChain = (chain: string) => {
    setCurrentChain(getChainOption(chain));
  };

  React.useEffect(() => {
    if (!currentChain) {
      setCurrentChain(CHAIN_OPTIONS[0]);
    }
  }, [currentChain]);

  return (
    <>
      {currentChain ?
        <ChainSelector
          chainOptions={CHAIN_OPTIONS}
          currentChain={currentChain}
          onChange={handleUpdateChain} /> :
        null
      }
    </>
  );
};

export type { ChainOption };
export default Chains;
