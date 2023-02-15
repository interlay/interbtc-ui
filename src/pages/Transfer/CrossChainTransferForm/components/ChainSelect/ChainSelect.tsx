import { chain } from '@react-aria/utils';
import { forwardRef, useState } from 'react';

import { Flex } from '@/component-library';
import { SelectTrigger } from '@/component-library/Select';

import { ChainIcon } from '../ChainIcon';
import { ChainListModal } from './ChainListModal';
import { StyledChain } from './ChainSelect.style';
import { ChainSelectLabel } from './ChainSelectLabel';

type Chain = {
  display: string;
  id: string;
};

type Chains = Chain[];

type Props = {
  chains: Chains;
};

type ChainSelectProps = Props;

const ChainSelect = forwardRef<HTMLInputElement, ChainSelectProps>(
  ({ chains = [] }): JSX.Element => {
    const [chainValue, setChainValue] = useState(chains[0].id);
    const [isOpen, setOpen] = useState(false);

    const selectedChain = chains.find((chain) => chain.id === chainValue);

    const handleClose = () => setOpen(false);

    const handleChainChange = (chain: string) => {
      setChainValue(chain);
    };

    return (
      <>
        <ChainSelectLabel>Select Chain</ChainSelectLabel>
        <SelectTrigger onPress={() => setOpen(true)}>
          {selectedChain && (
            <Flex elementType='span' alignItems='center' justifyContent='space-evenly' gap='spacing2'>
              <ChainIcon id={selectedChain.id} />
              <StyledChain>{selectedChain?.display}</StyledChain>
            </Flex>
          )}
        </SelectTrigger>
        <ChainListModal
          isOpen={isOpen}
          chains={chains}
          selectedChain={chainValue}
          onClose={handleClose}
          onSelectionChange={chain(handleChainChange, handleClose)}
        />
      </>
    );
  }
);

ChainSelect.displayName = 'ChainSelect';

export { ChainSelect };
export type { Chain, Chains, ChainSelectProps };
