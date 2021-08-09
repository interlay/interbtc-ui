
import clsx from 'clsx';

import IssueRequestsTable from './IssueRequestsTable';
import RedeemRequestsTable from './RedeemRequestsTable';
import MainContainer from 'parts/MainContainer';

const Transactions = (): JSX.Element => {
  return (
    <MainContainer
      className={clsx(
        'space-y-10',
        'container',
        'm-auto'
      )}>
      <IssueRequestsTable />
      <RedeemRequestsTable />
    </MainContainer>
  );
};

export default Transactions;
