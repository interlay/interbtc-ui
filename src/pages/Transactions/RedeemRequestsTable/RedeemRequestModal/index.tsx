import { useTranslation } from 'react-i18next';

import { Modal, ModalBody, ModalHeader } from '@/component-library';
import RedeemUI from '@/legacy-components/RedeemUI';
import { Props as ModalProps } from '@/legacy-components/UI/InterlayModal';

interface CustomProps {
  // TODO: should type properly (`Relay`)
  request: any;
}

const RedeemRequestModal = ({
  open,
  onClose,
  request
}: CustomProps & Omit<ModalProps, 'children'>): JSX.Element | null => {
  const { t } = useTranslation();

  return (
    <Modal align='top' isOpen={open} onClose={onClose}>
      <ModalHeader>{t('issue_page.request', { id: request.id })}</ModalHeader>
      <ModalBody>
        <RedeemUI redeem={request} onClose={onClose} />
      </ModalBody>
    </Modal>
  );
};

export default RedeemRequestModal;
