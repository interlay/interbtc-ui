import { useTranslation } from 'react-i18next';

import ExternalLink from '@/components/ExternalLink';
import { SUBSCAN_LINK } from '@/config/relay-chains';
import MainContainer from '@/parts/MainContainer';
import { useSubstrateSecureState } from '@/substrate-lib/substrate-context';

import IssueRequestsTable from './IssueRequestsTable';
import RedeemRequestsTable from './RedeemRequestsTable';

const Transactions = (): JSX.Element => {
  const { selectedAccount } = useSubstrateSecureState();
  const { t } = useTranslation();

  return (
    <MainContainer>
      <ExternalLink href={`${SUBSCAN_LINK}/account/${selectedAccount?.address ?? ''}`} className='font-medium'>
        {t('view_all_transactions_on_subscan')}
      </ExternalLink>
      <IssueRequestsTable />
      <RedeemRequestsTable />
    </MainContainer>
  );
};

export default Transactions;
