
import {
  Redeem,
  RedeemStatus
} from '@interlay/interbtc-api';

import CompletedRedeemRequest from './CompletedRedeemRequest';
import ReimbursedRedeemRequest from './ReimbursedRedeemRequest';
import RetriedRedeemRequest from './RetriedRedeemRequest';
import PendingWithBtcTxNotFoundRedeemRequest from './PendingWithBtcTxNotFoundRedeemRequest';
import DefaultRedeemRequest from './DefaultRedeemRequest';

interface Props {
  request: Redeem;
}

const RedeemRequestStatusUI = ({
  request
}: Props): JSX.Element => {
  switch (request.status) {
  case RedeemStatus.Completed:
    return <CompletedRedeemRequest request={request} />;
  case RedeemStatus.PendingWithBtcTxNotFound:
    return <PendingWithBtcTxNotFoundRedeemRequest request={request} />;
  case RedeemStatus.Reimbursed:
    return <ReimbursedRedeemRequest request={request} />;
  case RedeemStatus.Retried:
    return <RetriedRedeemRequest request={request} />;
  default:
    return <DefaultRedeemRequest request={request} />;
  }
};

export default RedeemRequestStatusUI;
