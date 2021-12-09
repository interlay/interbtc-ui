
import {
  Issue,
  IssueStatus
} from '@interlay/interbtc-api';

import CompletedIssueRequest from './CompletedIssueRequest';
import CancelledIssueRequest from './CancelledIssueRequest';
import ReceivedIssueRequest from './ReceivedIssueRequest';
import ConfirmedIssueRequest from './ConfirmedIssueRequest';

interface Props {
  request: Issue;
}

const IssueRequestStatusUI = ({
  request
}: Props): JSX.Element => {
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
