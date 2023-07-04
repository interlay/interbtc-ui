import { Modal, ModalBody } from '@/component-library';
import IssueUI from '@/legacy-components/IssueUI';
import { Props as ModalProps } from '@/legacy-components/UI/InterlayModal';

interface CustomProps {
  request: any; // TODO: should type properly (`Relay`)
}

const IssueRequestModal = ({ open, onClose, request }: CustomProps & Omit<ModalProps, 'children'>): JSX.Element => {
  return (
    <Modal align='top' isOpen={open} onClose={onClose}>
      <ModalBody>
        <IssueUI issue={request} />
      </ModalBody>
    </Modal>
  );
};

export default IssueRequestModal;
