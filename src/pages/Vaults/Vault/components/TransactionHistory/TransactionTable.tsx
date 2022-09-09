import { HTMLAttributes, useState } from 'react';

import IssueRequestModal from '@/pages/Transactions/IssueRequestsTable/IssueRequestModal';
import RedeemRequestModal from '@/pages/Transactions/RedeemRequestsTable/RedeemRequestModal';

import { StyledDate, StyledRequest, StyledRequestCell, StyledTable } from './TransactionHistory.styles';
import { TransactionStatus, TransactionStatusTag } from './TransactionStatusTag';

const columns = [
  { name: 'Request', uid: 'request' },
  { name: 'Amount', uid: 'amount' },
  { name: 'Status', uid: 'status' }
];

type TransactionTableData = {
  id: string;
  request: string;
  date: string;
  amount: string;
  status: TransactionStatus;
  // This `any` is an upstream issue - issue and redeem request data
  // hasn't been typed properly. This is a TODO, but out of scope here.
  requestData: any;
};

type Props = {
  data: TransactionTableData[];
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type TransactionTableProps = Props & NativeAttrs;

const RequestCell = ({ request, date }: any) => (
  <StyledRequestCell>
    <StyledRequest>{request}</StyledRequest>
    <StyledDate color='tertiary'>{date}</StyledDate>
  </StyledRequestCell>
);

const TransactionTable = ({ data, ...props }: TransactionTableProps): JSX.Element => {
  const [selectedRequest, setSelectedRequest] = useState<{ type: string; data: any } | undefined>(undefined);

  const rows = data.map(({ request, requestData, amount, date, status }, key) => ({
    id: key,
    amount,
    request: <RequestCell request={request} date={date} />,
    status: (
      <TransactionStatusTag onClick={() => setSelectedRequest({ type: request, data: requestData })} status={status} />
    )
  }));

  return (
    <>
      <StyledTable columns={columns} rows={rows} {...props} />
      {/* TODO: these modals should be refactored/replaced */}
      {selectedRequest?.type === 'Issue' && (
        <IssueRequestModal
          open={selectedRequest.type === 'Issue'}
          onClose={() => setSelectedRequest(undefined)}
          request={selectedRequest.data}
        />
      )}
      {selectedRequest?.type === 'Redeem' && (
        <RedeemRequestModal
          open={selectedRequest.type === 'Redeem'}
          onClose={() => setSelectedRequest(undefined)}
          request={selectedRequest.data}
        />
      )}
      ;
    </>
  );
};

export { TransactionTable };
export type { TransactionTableData, TransactionTableProps };
