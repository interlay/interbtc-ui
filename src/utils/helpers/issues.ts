import { IssueStatus } from '@interlay/interbtc-api';

import { IssueRequestWithStatusDecoded } from '@/types/issues.d';

const getManualIssueRequests = (
  issueRequests: Array<IssueRequestWithStatusDecoded>
): Array<IssueRequestWithStatusDecoded> => {
  return issueRequests.filter((item) => {
    switch (item.status) {
      case IssueStatus.Cancelled:
      case IssueStatus.Expired: {
        return item.backingPayment.btcTxId ? true : false;
      }
      case IssueStatus.PendingWithEnoughConfirmations:
        return true;
      default:
        return false;
    }
  });
};

export { getManualIssueRequests };
