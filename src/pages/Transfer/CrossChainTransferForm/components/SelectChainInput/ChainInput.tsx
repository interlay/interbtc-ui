import { forwardRef, useState } from 'react';

import { ChainInputLabel } from './ChainInputLabel';
import { ChainSelect } from './ChainSelect';

type Chain = {
  display: string;
  id: string;
};

type Chains = Chain[];

type Props = {
  chains: Chains;
};

type ChainInputProps = Props;

const ChainInput = forwardRef<HTMLInputElement, ChainInputProps>(
  ({ chains = [] }): JSX.Element => {
    const [chainValue, setChainValue] = useState(chains[0].id);

    const handleChainChange = (chain: string) => {
      setChainValue(chain);
    };

    const isSelectDisabled = !chains?.length;

    return (
      <>
        <ChainInputLabel>Select Chain</ChainInputLabel>
        <ChainSelect value={chainValue} isDisabled={isSelectDisabled} chains={chains} onChange={handleChainChange} />
      </>
    );
  }
);

ChainInput.displayName = 'ChainInput';

export { ChainInput };
export type { Chain, ChainInputProps, Chains };
