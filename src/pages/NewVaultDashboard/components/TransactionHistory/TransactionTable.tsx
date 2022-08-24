import { HTMLAttributes, memo } from 'react';

import { StyledDate, StyledRequest, StyledRequestCell, StyledTable } from './TransactionHistory.styles';
import { TransactionStatus, TransactionStatusTag } from './TransactionStatusTag';

const columns = [
  { name: 'Request', uid: 'request' },
  { name: 'Amount', uid: 'amount' },
  { name: 'Status', uid: 'status' }
];

type TransactionTableRow = {
  request: string;
  date: string;
  amount: string;
  status: TransactionStatus;
};

type Props = {
  data: TransactionTableRow[];
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type TransactionTableProps = Props & NativeAttrs;

const RequestCell = ({ request, date }: any) => (
  <StyledRequestCell>
    <StyledRequest>{request}</StyledRequest>
    <StyledDate color='tertiary'>{date}</StyledDate>
  </StyledRequestCell>
);

const _TransactionTable = ({ data, ...props }: TransactionTableProps): JSX.Element => {
  const rows = data.map(({ request, amount, date, status }, key) => ({
    id: key,
    amount,
    request: <RequestCell request={request} date={date} />,
    status: <TransactionStatusTag status={status} />
  }));

  return <StyledTable columns={columns} rows={rows} {...props} />;
};

const TransactionTable = memo(_TransactionTable);

export { TransactionTable };
export type { TransactionTableProps };
