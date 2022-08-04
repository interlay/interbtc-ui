import { IssueStatus } from '@interlay/interbtc-api';

import CancelledIssueRequest from './CancelledIssueRequest';
import CompletedIssueRequest from './CompletedIssueRequest';
import ConfirmedIssueRequest from './ConfirmedIssueRequest';
import ReceivedIssueRequest from './ReceivedIssueRequest';

interface Props {
  // TODO: should type properly (`Relay`)
  request: any;
}

const IssueRequestStatusUI = ({ request }: Props): JSX.Element => {
  switch (request.status) {
    case IssueStatus.Completed:
      return <CompletedIssueRequest request={request} />;
    case IssueStatus.Cancelled:
    case IssueStatus.Expired:
      return <CancelledIssueRequest />;
    case IssueStatus.PendingWithBtcTxNotIncluded:
    case IssueStatus.PendingWithTooFewConfirmations:
      return <ReceivedIssueRequest request={request} />;
    case IssueStatus.PendingWithEnoughConfirmations:
      return <ConfirmedIssueRequest request={request} />;
    default:
      throw new Error('Invalid issue request status!');
  }
};

export default IssueRequestStatusUI;
