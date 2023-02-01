import { RedeemStatus } from '@interlay/interbtc-api';

import CompletedRedeemRequest from './CompletedRedeemRequest';
import DefaultRedeemRequest from './DefaultRedeemRequest';
import PendingWithBtcTxNotFoundRedeemRequest from './PendingWithBtcTxNotFoundRedeemRequest';
import ReimbursedRedeemRequest from './ReimbursedRedeemRequest';
import RetriedRedeemRequest from './RetriedRedeemRequest';

interface Props {
  // TODO: should type properly (`Relay`)
  redeem: any;
}

const RedeemRequestStatusUI = ({ redeem }: Props): JSX.Element => {
  switch (redeem.status) {
    case RedeemStatus.Completed:
      return <CompletedRedeemRequest redeem={redeem} />;
    case RedeemStatus.PendingWithBtcTxNotFound:
      return <PendingWithBtcTxNotFoundRedeemRequest redeem={redeem} />;
    case RedeemStatus.Reimbursed:
      return <ReimbursedRedeemRequest redeem={redeem} />;
    case RedeemStatus.Retried:
      return <RetriedRedeemRequest redeem={redeem} />;
    default:
      return <DefaultRedeemRequest redeem={redeem} />;
  }
};

export default RedeemRequestStatusUI;
