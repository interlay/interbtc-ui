import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import { Modal, ModalBody, ModalHeader, ModalProps } from '@/component-library/Modal';

import { ChainList } from './ChainList';

type Props = {
  chains: InjectedAccountWithMeta[];
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
    <ModalBody overflow='hidden'>
      <ChainList items={chains} selectedChain={selectedChain} onSelectionChange={onSelectionChange} />
    </ModalBody>
  </Modal>
);

export { ChainListModal };
export type { ChainListModalProps };
