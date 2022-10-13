import { useTranslation } from 'react-i18next';

import ExternalLink from '@/components/ExternalLink';
import { SUBSCAN_LINK } from '@/config/relay-chains';
import { useSubstrateSecureState } from '@/lib/substrate';
import MainContainer from '@/parts/MainContainer';

import IssueRequestsTable from './IssueRequestsTable';
import RedeemRequestsTable from './RedeemRequestsTable';

const Transactions = (): JSX.Element => {
  const { selectedAccount } = useSubstrateSecureState();
  const { t } = useTranslation();

  return (
    <MainContainer>
      {selectedAccount && (
        <ExternalLink href={`${SUBSCAN_LINK}/account/${selectedAccount.address}`} className='font-medium'>
          {t('view_all_transactions_on_subscan')}
        </ExternalLink>
      )}
      <IssueRequestsTable />
      <RedeemRequestsTable />
    </MainContainer>
  );
};

export default Transactions;
