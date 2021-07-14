import { Issue } from '@interlay/interbtc';

export interface IssueState {
  // ray test touch <
  // TODO: use current account from general state
  address: string;
  // ray test touch >
  // mapping of all issue requests
  issueRequests: Map<string, Issue[]>;
  // issue period in seconds
  issuePeriod: number;
}
