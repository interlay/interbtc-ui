// ray test touch <
import { IssueActions } from '../types/actions.types';
import { IssueState } from '../types/issue.types';

const initialState = {
  issuePeriod: 86400
};

export const issueReducer = (state: IssueState = initialState, action: IssueActions): IssueState => {
  switch (action.type) {
    default:
      return state;
  }
};
// ray test touch >