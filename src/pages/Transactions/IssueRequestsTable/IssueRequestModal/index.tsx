import { useTranslation } from 'react-i18next';

import { Modal, ModalBody, ModalHeader } from '@/component-library';
import IssueUI from '@/legacy-components/IssueUI';
import { Props as ModalProps } from '@/legacy-components/UI/InterlayModal';

interface CustomProps {
  request: any; // TODO: should type properly (`Relay`)
}

const IssueRequestModal = ({ open, onClose, request }: CustomProps & Omit<ModalProps, 'children'>): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Modal align='top' isOpen={open} onClose={onClose}>
      <ModalHeader>{t('issue_page.request', { id: request.id })}</ModalHeader>
      <ModalBody>
        <IssueUI issue={request} />
      </ModalBody>
    </Modal>
  );
};

export default IssueRequestModal;
