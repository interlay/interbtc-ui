import { HTMLAttributes, memo } from 'react';

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
  requestData: any;
};

type Props = {
  callBack: (data: any) => void;
  data: TransactionTableData[];
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type TransactionTableProps = Props & NativeAttrs;

const RequestCell = ({ request, date, requestData, callBack }: any) => (
  <StyledRequestCell>
    <StyledRequest onClick={() => callBack(requestData)}>{request}</StyledRequest>
    <StyledDate color='tertiary'>{date}</StyledDate>
  </StyledRequestCell>
);

const _TransactionTable = ({ data, ...props }: TransactionTableProps): JSX.Element => {
  const rows = data.map(({ request, requestData, amount, date, status }, key) => ({
    id: key,
    amount,
    request: <RequestCell requestData={requestData} callBack={props.callBack} request={request} date={date} />,
    status: <TransactionStatusTag status={status} />
  }));

  return <StyledTable columns={columns} rows={rows} {...props} />;
};

const TransactionTable = memo(_TransactionTable);

export { TransactionTable };
export type { TransactionTableData, TransactionTableProps };
