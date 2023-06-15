import { Issue } from '@interlay/interbtc-api';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { Modal, ModalBody, ModalFooter } from '@/component-library';
import InterlayDefaultContainedButton from '@/legacy-components/buttons/InterlayDefaultContainedButton';
import BTCPaymentPendingStatusUI from '@/legacy-components/IssueUI/BTCPaymentPendingStatusUI';
import { Props as ModalProps } from '@/legacy-components/UI/InterlayModal';
import InterlayRouterLink from '@/legacy-components/UI/InterlayRouterLink';
import { PAGES, QUERY_PARAMETERS } from '@/utils/constants/links';
import { getColorShade } from '@/utils/helpers/colors';

const queryString = require('query-string');

interface CustomProps {
  request: Issue;
}

const LegacyIssueModal = ({ open, onClose, request }: CustomProps & Omit<ModalProps, 'children'>): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Modal align='top' isOpen={open} onClose={onClose}>
      <ModalBody>
        <div className={clsx('flex', 'flex-col', 'space-y-8')}>
          <h4 className={clsx('text-2xl', getColorShade('yellow'), 'font-medium', 'text-center')}>
            {t('issue_page.deposit')}
          </h4>
          <BTCPaymentPendingStatusUI request={request} />
        </div>
      </ModalBody>
      <ModalFooter>
        <InterlayRouterLink
          to={{
            pathname: PAGES.BRIDGE,
            search: queryString.stringify({
              [QUERY_PARAMETERS.ISSUE_REQUEST_ID]: request.id
            })
          }}
        >
          <InterlayDefaultContainedButton onClick={onClose} className='w-full'>
            {t('issue_page.i_have_made_the_payment')}
          </InterlayDefaultContainedButton>
        </InterlayRouterLink>{' '}
      </ModalFooter>
    </Modal>
  );
};

export { LegacyIssueModal };
