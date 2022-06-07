// ray test touch <
import { useParams } from 'react-router-dom';

import { URL_PARAMETERS } from 'utils/constants/links';

const IssueTransaction = (): JSX.Element => {
  const { [URL_PARAMETERS.TRANSACTION_TYPE]: transactionType } = useParams<Record<string, string>>();

  return (
    <>IssueTransaction {transactionType}</>
  );
};

export default IssueTransaction;
// ray test touch >