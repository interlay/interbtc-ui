import { HTMLAttributes, memo } from 'react';

import { StyledDate, StyledRequest, StyledRequestCell, StyledTable } from './TransactionHistory.styles';
import { TransationStatus, TransationStatusTag } from './TransactionStatusTag';

const columns = [
  { name: 'Request', uid: 'request' },
  { name: 'Amount', uid: 'amount' },
  { name: 'Status', uid: 'status' }
];

type TransationTableRow = {
  request: string;
  date: string;
  amount: string;
  status: TransationStatus;
};

type Props = {
  data: TransationTableRow[];
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type TransationTableProps = Props & NativeAttrs;

const RequestCell = ({ request, date }: any) => (
  <StyledRequestCell>
    <StyledRequest>{request}</StyledRequest>
    <StyledDate color='tertiary'>{date}</StyledDate>
  </StyledRequestCell>
);

const _TransationTable = ({ data, ...props }: TransationTableProps): JSX.Element => {
  const rows = data.map(({ request, amount, date, status }, key) => ({
    id: key,
    amount,
    request: <RequestCell request={request} date={date} />,
    status: <TransationStatusTag status={status} />
  }));

  return <StyledTable columns={columns} rows={rows} {...props} />;
};

const TransationTable = memo(_TransationTable);

export { TransationTable };
export type { TransationTableProps };
