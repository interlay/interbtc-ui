import { useTranslation } from 'react-i18next';

import { Card } from '@/component-library';
import { SUBSCAN_LINK } from '@/config/relay-chains';
import ExternalLink from '@/legacy-components/ExternalLink';
import { useSubstrateSecureState } from '@/lib/substrate';

import IssueRequestsTable from './IssueRequestsTable';
import RedeemRequestsTable from './RedeemRequestsTable';

const Transactions = (): JSX.Element => {
  const { selectedAccount } = useSubstrateSecureState();
  const { t } = useTranslation();

  return (
    <Card>
      <IssueRequestsTable />
      <RedeemRequestsTable />
      {selectedAccount && (
        <ExternalLink href={`${SUBSCAN_LINK}/account/${selectedAccount.address}`} className='font-medium'>
          {t('view_all_transactions_on_subscan')}
        </ExternalLink>
      )}
    </Card>
  );
};

export default Transactions;
