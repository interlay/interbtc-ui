import { Modal, ModalBody, ModalHeader, ModalProps } from '@/component-library';

type InheritAttrs = Omit<ModalProps, 'children'>;

type TokenListModalProps = InheritAttrs;

const AccountSelectorModal = ({ ...props }: TokenListModalProps): JSX.Element => (
  <Modal hasMaxHeight {...props}>
    <ModalHeader size='lg' weight='medium' color='secondary'>
      Select Account
    </ModalHeader>
    <ModalBody overflow='hidden' noPadding>
      <p>These are your accounts</p>
    </ModalBody>
  </Modal>
);

export { AccountSelectorModal };
