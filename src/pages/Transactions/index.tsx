
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import IssueRequestsTable from './IssueRequestsTable';
import RedeemRequestsTable from './RedeemRequestsTable';
import MainContainer from 'parts/MainContainer';
import ExternalLink from 'components/ExternalLink';
import { SUBSCAN_LINK } from 'config/relay-chains';
import { StoreType } from 'common/types/util.types';

const Transactions = (): JSX.Element => {
  const { address } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();

  return (
    <MainContainer>
      <ExternalLink
        href={`${SUBSCAN_LINK}/account/${address}`}
        className='font-medium'>
        {t('view_all_transactions_on_subscan')}
      </ExternalLink>
      <IssueRequestsTable />
      <RedeemRequestsTable />
    </MainContainer>
  );
};

export default Transactions;
