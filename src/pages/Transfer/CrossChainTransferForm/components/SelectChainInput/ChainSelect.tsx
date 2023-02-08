import { chain } from '@react-aria/utils';
import { useState } from 'react';

import { CoinIcon, Flex } from '@/component-library';
import { SelectTrigger } from '@/component-library/Select';

import { Chains } from './ChainInput';
import { StyledChain } from './ChainInput.style';
import { ChainListModal } from './ChainListModal';

type ChainSelectProps = {
  value?: string;
  icons?: string[];
  chains: Chains;
  onChange: (chain: string) => void;
  isDisabled?: boolean;
};

const ChainSelect = ({ value, chains, isDisabled, onChange }: ChainSelectProps): JSX.Element => {
  const [isOpen, setOpen] = useState(false);
  const selectedChain = chains.find((chain) => chain.id === value);

  const handleClose = () => setOpen(false);

  return (
    <>
      <SelectTrigger onPress={() => setOpen(true)} disabled={isDisabled}>
        {selectedChain && (
          <Flex elementType='span' alignItems='center' justifyContent='space-evenly' gap='spacing4'>
            <CoinIcon ticker={selectedChain.nativeToken} />
            <StyledChain>{selectedChain?.display}</StyledChain>
          </Flex>
        )}
      </SelectTrigger>
      <ChainListModal
        isOpen={isOpen}
        chains={chains}
        selectedChain={value}
        onClose={handleClose}
        onSelectionChange={chain(onChange, handleClose)}
      />
    </>
  );
};

export { ChainSelect };
export type { ChainSelectProps };
