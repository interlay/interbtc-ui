import { Modal, ModalBody, ModalHeader, ModalProps } from '@/component-library';

const AccountSelectorModal = ({ ...props }: ModalProps): JSX.Element => (
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
