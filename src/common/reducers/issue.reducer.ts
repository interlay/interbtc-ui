// ray test touch <
import { IssueActions, UPDATE_ISSUE_PERIOD } from '../types/actions.types';
// ray test touch >
import { IssueState } from '../types/issue.types';

const initialState = {
  issuePeriod: 86400
};

export const issueReducer = (state: IssueState = initialState, action: IssueActions): IssueState => {
  switch (action.type) {
    // ray test touch <
    case UPDATE_ISSUE_PERIOD: {
      return { ...state, issuePeriod: action.period };
    }
    // ray test touch >
    default:
      return state;
  }
};
