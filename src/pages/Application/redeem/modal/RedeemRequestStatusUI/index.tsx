
import CompletedRedeemRequest from './CompletedRedeemRequest';
import ReimbursedRedeemRequest from './ReimbursedRedeemRequest';
import RetriedRedeemRequest from './RetriedRedeemRequest';
import PendingWithBtcTxNotFoundRedeemRequest from './PendingWithBtcTxNotFoundRedeemRequest';
import DefaultRedeemRequest from './DefaultRedeemRequest';
import {
  RedeemRequest,
  RedeemRequestStatus
} from 'common/types/redeem.types';

interface Props {
  request: RedeemRequest;
}

const RedeemRequestStatusUI = ({
  request
}: Props): JSX.Element => {
  function getStatus(status: RedeemRequestStatus): JSX.Element {
    switch (status) {
    case RedeemRequestStatus.Completed:
      return <CompletedRedeemRequest request={request} />;
    case RedeemRequestStatus.PendingWithBtcTxNotFound:
      return <PendingWithBtcTxNotFoundRedeemRequest request={request} />;
    case RedeemRequestStatus.Reimbursed:
      return <ReimbursedRedeemRequest request={request} />;
    case RedeemRequestStatus.Retried:
      return <RetriedRedeemRequest request={request} />;
    default:
      return <DefaultRedeemRequest request={request} />;
    }
  }

  return <div className='status-view'>{getStatus(request.status)}</div>;
};

export default RedeemRequestStatusUI;
