
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

const IssueRequestStatusUI = (props: Props): JSX.Element => {
  function renderStatus(status: IssueRequestStatus) {
    // MEMO: the following states are handled already in IssueModal.tsx
    // IssueRequestStatus.RequestedRefund
    // IssueRequestStatus.PendingWithBtcTxNotFound
    switch (status) {
    case IssueRequestStatus.Completed:
      return <CompletedIssueRequest request={props.request} />;
    case IssueRequestStatus.Cancelled:
    case IssueRequestStatus.Expired:
      return <CancelledIssueRequest />;
    case IssueRequestStatus.PendingWithBtcTxNotIncluded:
    case IssueRequestStatus.PendingWithTooFewConfirmations:
      return <ReceivedIssueRequest request={props.request} />;
    case IssueRequestStatus.PendingWithEnoughConfirmations:
      return <ConfirmedIssueRequest request={props.request} />;
    }
  }

  return <>{renderStatus(props.request.status)}</>;
};

export default IssueRequestStatusUI;
