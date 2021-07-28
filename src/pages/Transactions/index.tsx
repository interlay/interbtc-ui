
import clsx from 'clsx';

import IssueRequestsTable from './IssueRequestsTable';
import RedeemRequestsTable from './RedeemRequestsTable';

const Requests = (): JSX.Element => {
  return (
    <div
      className={clsx(
        'space-y-8',
        'p-8'
      )}>
      <IssueRequestsTable />
      <RedeemRequestsTable />
    </div>
  );
};

export default Requests;
