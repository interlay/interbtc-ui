import clsx from 'clsx';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import CloseIconButton from '@/legacy-components/buttons/CloseIconButton';
import Hr1 from '@/legacy-components/hrs/Hr1';
import IssueUI from '@/legacy-components/IssueUI';
import InterlayModal, { InterlayModalInnerWrapper, Props as ModalProps } from '@/legacy-components/UI/InterlayModal';

import RequestModalTitle from '../../RequestModalTitle';

interface CustomProps {
  request: any; // TODO: should type properly (`Relay`)
  issueRequestsRefetch: () => Promise<void>;
}

const IssueRequestModal = ({
  open,
  onClose,
  request,
  issueRequestsRefetch
}: CustomProps & Omit<ModalProps, 'children'>): JSX.Element => {
  const { t } = useTranslation();

  const focusRef = React.useRef(null);

  return (
    <InterlayModal initialFocus={focusRef} open={open} onClose={onClose}>
      <InterlayModalInnerWrapper className={clsx('p-12', 'max-w-5xl')}>
        <RequestModalTitle>{t('issue_page.request', { id: request.id })}</RequestModalTitle>
        <Hr1 className={clsx('border-t-2', 'my-2')} />
        <CloseIconButton ref={focusRef} onClick={onClose} />
        <IssueUI issue={request} issueRequestsRefetch={issueRequestsRefetch} />
      </InterlayModalInnerWrapper>
    </InterlayModal>
  );
};

export default IssueRequestModal;
