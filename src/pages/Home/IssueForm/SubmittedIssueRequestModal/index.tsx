import * as React from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import BTCPaymentPendingStatusUI from 'pages/Requests/IssueRequestsTable/IssueRequestModal/BTCPaymentPendingStatusUI';
import InterlayDefaultContainedButton from 'components/buttons/InterlayDefaultContainedButton';
import IconButton from 'components/IconButton';
import InterlayModal, {
  Props as ModalProps,
  InterlayModalInnerWrapper
} from 'components/UI/InterlayModal';
import { ReactComponent as CloseIcon } from 'assets/img/icons/close.svg';
import { Issue } from '@interlay/interbtc';

interface CustomProps {
  request: Issue
}

const SubmittedIssueRequestModal = ({
  open,
  onClose,
  request
}: CustomProps & Omit<ModalProps, 'children'>): JSX.Element => {
  const { t } = useTranslation();

  const focusRef = React.useRef(null);

  return (
    <InterlayModal
      initialFocus={focusRef}
      open={open}
      onClose={onClose}>
      <InterlayModalInnerWrapper
        className={clsx(
          'p-8',
          'max-w-lg'
        )}>
        <IconButton
          ref={focusRef}
          className={clsx(
            'w-12',
            'h-12',
            'absolute',
            'top-3',
            'right-3'
          )}
          onClick={onClose}>
          <CloseIcon
            width={18}
            height={18}
            className='text-textSecondary' />
        </IconButton>
        <div
          className={clsx(
            'flex',
            'flex-col',
            'space-y-8'
          )}>
          <h4
            className={clsx(
              'text-2xl',
              'text-interlayCalifornia',
              'font-medium',
              'text-center'
            )}>
            {t('issue_page.deposit')}
          </h4>
          <BTCPaymentPendingStatusUI request={request} />
          <InterlayDefaultContainedButton onClick={onClose}>
            {t('issue_page.made_payment')}
          </InterlayDefaultContainedButton>
        </div>
      </InterlayModalInnerWrapper>
    </InterlayModal>
  );
};

export default SubmittedIssueRequestModal;
