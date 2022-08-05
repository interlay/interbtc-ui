import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import ExternalLink from '@/components/ExternalLink';
import { SUBSCAN_LINK } from '@/config/relay-chains';
import MainContainer from '@/parts/MainContainer';

import IssueRequestsTable from './IssueRequestsTable';
import RedeemRequestsTable from './RedeemRequestsTable';

const Transactions = (): JSX.Element => {
  const { address } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();

  return (
    <MainContainer>
      <ExternalLink href={`${SUBSCAN_LINK}/account/${address}`} className='font-medium'>
        {t('view_all_transactions_on_subscan')}
      </ExternalLink>
      <IssueRequestsTable />
      <RedeemRequestsTable />
    </MainContainer>
  );
};

export default Transactions;
