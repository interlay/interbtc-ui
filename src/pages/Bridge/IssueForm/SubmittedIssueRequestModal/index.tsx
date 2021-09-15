
import * as React from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Issue } from '@interlay/interbtc-api';

import
BTCPaymentPendingStatusUI
  from 'pages/Transactions/IssueRequestsTable/IssueRequestModal/BTCPaymentPendingStatusUI';
import InterlayDefaultContainedButton from 'components/buttons/InterlayDefaultContainedButton';
import IconButton from 'components/buttons/IconButton';
import InterlayModal, {
  Props as ModalProps,
  InterlayModalInnerWrapper
} from 'components/UI/InterlayModal';
import InterlayRouterLink from 'components/UI/InterlayRouterLink';
import {
  PAGES,
  QUERY_PARAMETERS
} from 'utils/constants/links';
import { ReactComponent as CloseIcon } from 'assets/img/icons/close.svg';

const queryString = require('query-string');

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
          <InterlayRouterLink
            to={{
              pathname: PAGES.TRANSACTIONS,
              search: queryString.stringify({
                [QUERY_PARAMETERS.ISSUE_REQUEST_ID]: request.id
              })
            }}>
            <InterlayDefaultContainedButton
              onClick={onClose}
              className='w-full'>
              {t('issue_page.i_have_made_the_payment')}
            </InterlayDefaultContainedButton>
          </InterlayRouterLink>
        </div>
      </InterlayModalInnerWrapper>
    </InterlayModal>
  );
};

export default SubmittedIssueRequestModal;
