import { getRequestIdsFromEvents, Issue } from '@interlay/interbtc-api';
import { ISubmittableResult } from '@polkadot/types/types';

const getIssueRequestsFromExtrinsicResult = async (result: ISubmittableResult): Promise<Array<Issue>> => {
  const ids = getRequestIdsFromEvents(result.events, window.bridge.api.events.issue.RequestIssue, window.bridge.api);
  const issueRequests = await window.bridge.issue.getRequestsByIds(ids);
  return issueRequests;
};

export { getIssueRequestsFromExtrinsicResult };
