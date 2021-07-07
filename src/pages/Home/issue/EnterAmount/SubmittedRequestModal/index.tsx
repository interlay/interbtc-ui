
import * as React from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import BTCPaymentPendingStatusUI from 'pages/Home/issue/BTCPaymentPendingStatusUI';
import InterlayDefaultContainedButton from 'components/buttons/InterlayDefaultContainedButton';
import IconButton from 'components/IconButton';
import { ReactComponent as CloseIcon } from 'assets/img/icons/close.svg';
import InterlayModal, {
  Props as ModalProps,
  InterlayModalInnerWrapper
} from 'components/UI/InterlayModal';
import { IssueRequest } from 'common/types/issue.types';
import { resetIssueWizardAction } from 'common/actions/issue.actions';

interface CustomProps {
  request: IssueRequest
}

const SubmittedRequestModal = ({
  open,
  onClose,
  request
}: CustomProps & Omit<ModalProps, 'children'>): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const focusRef = React.useRef(null);

  const handleClose = () => {
    onClose();
    // ray test touch <
    dispatch(resetIssueWizardAction());
    // ray test touch >
  };

  return (
    <InterlayModal
      initialFocus={focusRef}
      open={open}
      onClose={handleClose}>
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
        <>
          <h4
            className={clsx(
              'text-2xl',
              'text-interlayCalifornia',
              'font-medium',
              'text-center',
              'my-3'
            )}>
            {t('issue_page.deposit')}
          </h4>
        </>
        <BTCPaymentPendingStatusUI request={request} />
        <InterlayDefaultContainedButton
          style={{ display: 'flex' }}
          className={clsx(
            'mx-auto',
            'mt-8'
          )}
          onClick={handleClose}>
          {t('issue_page.made_payment')}
        </InterlayDefaultContainedButton>
      </InterlayModalInnerWrapper>
    </InterlayModal>
  );
};

export default SubmittedRequestModal;
