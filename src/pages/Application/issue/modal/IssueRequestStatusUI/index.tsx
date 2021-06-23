
import CompletedIssueRequest from './CompletedIssueRequest';
import CancelledIssueRequest from './CancelledIssueRequest';
import ReceivedIssueRequest from './ReceivedIssueRequest';
import ConfirmedIssueRequest from './ConfirmedIssueRequest';
import {
  IssueRequest,
  IssueRequestStatus
} from 'common/types/issue.types';

interface Props {
  request: IssueRequest;
}

const IssueRequestStatusUI = ({
  request
}: Props): JSX.Element => {
  switch (request.status) {
  case IssueRequestStatus.Completed:
    return <CompletedIssueRequest request={request} />;
  case IssueRequestStatus.Cancelled:
  case IssueRequestStatus.Expired:
    return <CancelledIssueRequest />;
  case IssueRequestStatus.PendingWithBtcTxNotIncluded:
  case IssueRequestStatus.PendingWithTooFewConfirmations:
    return <ReceivedIssueRequest request={request} />;
  case IssueRequestStatus.PendingWithEnoughConfirmations:
    return <ConfirmedIssueRequest request={request} />;
  default:
    throw new Error('Invalid issue request status!');
  }
};

export default IssueRequestStatusUI;
