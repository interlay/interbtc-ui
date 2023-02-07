import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { forwardRef, useState } from 'react';

import { KeyringPair } from '@/lib/substrate';

import { ChainInputLabel } from './ChainInputLabel';
import { ChainSelect } from './ChainSelect';

type Props = {
  chains?: InjectedAccountWithMeta[];
  chain?: KeyringPair;
};

type ChainInputProps = Props;

const ChainInput = forwardRef<HTMLInputElement, ChainInputProps>(
  ({ chains = [], chain }): JSX.Element => {
    const [chainValue, setChainValue] = useState(chain?.address);

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
export type { ChainInputProps };
