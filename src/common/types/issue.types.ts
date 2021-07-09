import { Issue } from '@interlay/interbtc';

export interface IssueState {
  // TODO: use current account from general state
  address: string;
  // current step in the wizard
  step: string;
  // id of the current issue request
  id: string;
  // mapping of all issue requests
  issueRequests: Map<string, Issue[]>;
  // issue period in seconds
  issuePeriod: number;
}
