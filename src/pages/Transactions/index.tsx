
// ray test touch <
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
// ray test touch >

import IssueRequestsTable from './IssueRequestsTable';
import RedeemRequestsTable from './RedeemRequestsTable';
import MainContainer from 'parts/MainContainer';
// ray test touch <
import ExternalLink from 'components/ExternalLink';
import { SUBSCAN_LINK } from 'config/relay-chains';
import { StoreType } from 'common/types/util.types';
// ray test touch >

const Transactions = (): JSX.Element => {
  // ray test touch <
  const { address } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();
  // ray test touch >

  return (
    <MainContainer>
      {/* ray test touch < */}
      <ExternalLink
        href={`${SUBSCAN_LINK}/account/${address}`}
        className='font-medium'>
        {t('view_all_transactions_on_subscan')}
      </ExternalLink>
      {/* ray test touch > */}
      <IssueRequestsTable />
      <RedeemRequestsTable />
    </MainContainer>
  );
};

export default Transactions;
