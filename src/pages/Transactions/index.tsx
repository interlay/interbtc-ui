
import IssueRequestsTable from './IssueRequestsTable';
import RedeemRequestsTable from './RedeemRequestsTable';
import MainContainer from 'parts/MainContainer';

const Transactions = (): JSX.Element => {
  return (
    <MainContainer>
      <IssueRequestsTable />
      <RedeemRequestsTable />
    </MainContainer>
  );
};

export default Transactions;
