import * as React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import RequestModalTitle from '../../RequestModalTitle';
import IssueUI from 'components/IssueUI';
import CloseIconButton from 'components/buttons/CloseIconButton';
import Hr1 from 'components/hrs/Hr1';
import InterlayModal, { Props as ModalProps, InterlayModalInnerWrapper } from 'components/UI/InterlayModal';

interface CustomProps {
  // TODO: should type properly (`Relay`)
  request: any;
}

const IssueRequestModal = ({ open, onClose, request }: CustomProps & Omit<ModalProps, 'children'>): JSX.Element => {
  const { t } = useTranslation();

  const focusRef = React.useRef(null);

  return (
    <InterlayModal initialFocus={focusRef} open={open} onClose={onClose}>
      <InterlayModalInnerWrapper className={clsx('p-12', 'max-w-5xl')}>
        <RequestModalTitle>{t('issue_page.request', { id: request.id })}</RequestModalTitle>
        <Hr1 className={clsx('border-t-2', 'my-2')} />
        <CloseIconButton ref={focusRef} onClick={onClose} />
        <IssueUI issue={request} />
      </InterlayModalInnerWrapper>
    </InterlayModal>
  );
};

export default IssueRequestModal;
