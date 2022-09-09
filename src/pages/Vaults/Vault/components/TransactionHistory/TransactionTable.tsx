import React, { HTMLAttributes, useEffect, useState } from 'react';

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
  const [selectedTableRow, setSelectedTableRow] = useState<any>(undefined);

  const rows = data.map(({ request, amount, requestData, date, status }, key) => ({
    id: key,
    amount,
    requestData,
    type: request,
    request: <RequestCell request={request} date={date} />,
    status: <TransactionStatusTag status={status} />
  }));

  const handleRowAction = (key: React.Key) => {
    setSelectedTableRow(rows.find((row) => row.id === key));
  };

  useEffect(() => {
    console.log(selectedTableRow);
  }, [selectedTableRow]);

  return (
    <>
      <StyledTable onRowAction={(key) => handleRowAction(key)} columns={columns} rows={rows} {...props} />
      {/* TODO: these modals should be refactored/replaced */}
      {selectedTableRow?.type === 'Issue' && (
        <IssueRequestModal
          open={selectedTableRow.type === 'Issue'}
          onClose={() => setSelectedTableRow(undefined)}
          request={selectedTableRow.requestData}
        />
      )}
      {selectedTableRow?.type === 'Redeem' && (
        <RedeemRequestModal
          open={selectedTableRow.type === 'Redeem'}
          onClose={() => setSelectedTableRow(undefined)}
          request={selectedTableRow.requestData}
        />
      )}
      ;
    </>
  );
};

export { TransactionTable };
export type { TransactionTableData, TransactionTableProps };
