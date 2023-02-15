import { Modal, ModalBody, ModalHeader, ModalProps } from '@/component-library/Modal';

import { ChainList } from './ChainList';
import { Chains } from './ChainSelect';

type Props = {
  chains: Chains;
  onSelectionChange?: (chain: string) => void;
  selectedChain?: string;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type ChainListModalProps = Props & InheritAttrs;

const ChainListModal = ({ selectedChain, chains, onSelectionChange, ...props }: ChainListModalProps): JSX.Element => (
  <Modal hasMaxHeight {...props}>
    <ModalHeader size='lg' weight='medium' color='secondary'>
      Select Chain
    </ModalHeader>
    <ModalBody overflow='hidden' noPadding>
      <ChainList items={chains} selectedChain={selectedChain} onSelectionChange={onSelectionChange} />
    </ModalBody>
  </Modal>
);

export { ChainListModal };
export type { ChainListModalProps };
