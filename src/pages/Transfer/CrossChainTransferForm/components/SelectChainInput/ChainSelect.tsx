import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import Identicon from '@polkadot/react-identicon';
import { chain } from '@react-aria/utils';
import { useState } from 'react';

import { Flex } from '@/component-library';
import { SelectTrigger } from '@/component-library/Select';

import { StyledChain } from './ChainInput.style';
import { ChainListModal } from './ChainListModal';

const Icon = ({ value }: Pick<ChainSelectProps, 'value'>) => {
  return <Identicon size={32} value={value} theme='polkadot' />;
};

type ChainSelectProps = {
  value?: string;
  icons?: string[];
  chains: InjectedAccountWithMeta[];
  onChange: (chain: string) => void;
  isDisabled?: boolean;
};

const ChainSelect = ({ value, chains, isDisabled, onChange }: ChainSelectProps): JSX.Element => {
  const [isOpen, setOpen] = useState(false);
  const selectedChain = chains.find((chain) => chain.address === value);

  const handleClose = () => setOpen(false);

  return (
    <>
      <SelectTrigger onPress={() => setOpen(true)} disabled={isDisabled}>
        <Flex elementType='span' alignItems='center' justifyContent='space-evenly' gap='spacing1'>
          <Icon value={selectedChain?.address} />
          <StyledChain>
            {selectedChain?.meta.name} {selectedChain?.address}
          </StyledChain>
        </Flex>
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
