import { Issue } from '@interlay/interbtc-api';
import clsx from 'clsx';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import CloseIconButton from '@/legacy-components/buttons/CloseIconButton';
import InterlayDefaultContainedButton from '@/legacy-components/buttons/InterlayDefaultContainedButton';
import BTCPaymentPendingStatusUI from '@/legacy-components/IssueUI/BTCPaymentPendingStatusUI';
import InterlayModal, { InterlayModalInnerWrapper, Props as ModalProps } from '@/legacy-components/UI/InterlayModal';
import InterlayRouterLink from '@/legacy-components/UI/InterlayRouterLink';
import { PAGES, QUERY_PARAMETERS } from '@/utils/constants/links';
import { getColorShade } from '@/utils/helpers/colors';

const queryString = require('query-string');

interface CustomProps {
  request: Issue;
}

const SubmittedIssueRequestModal = ({
  open,
  onClose,
  request
}: CustomProps & Omit<ModalProps, 'children'>): JSX.Element => {
  const { t } = useTranslation();

  const focusRef = React.useRef(null);

  return (
    <InterlayModal initialFocus={focusRef} open={open} onClose={onClose}>
      <InterlayModalInnerWrapper className={clsx('p-8', 'max-w-lg')}>
        <CloseIconButton ref={focusRef} onClick={onClose} />
        <div className={clsx('flex', 'flex-col', 'space-y-8')}>
          <h4 className={clsx('text-2xl', getColorShade('yellow'), 'font-medium', 'text-center')}>
            {t('issue_page.deposit')}
          </h4>
          <BTCPaymentPendingStatusUI request={request} />
          <InterlayRouterLink
            to={{
              pathname: PAGES.TRANSACTIONS,
              search: queryString.stringify({
                [QUERY_PARAMETERS.ISSUE_REQUEST_ID]: request.id
              })
            }}
          >
            <InterlayDefaultContainedButton onClick={onClose} className='w-full'>
              {t('issue_page.i_have_made_the_payment')}
            </InterlayDefaultContainedButton>
          </InterlayRouterLink>
        </div>
      </InterlayModalInnerWrapper>
    </InterlayModal>
  );
};

export default SubmittedIssueRequestModal;
