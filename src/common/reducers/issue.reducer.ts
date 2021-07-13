import {
  IssueActions,
  UPDATE_ISSUE_PERIOD
} from '../types/actions.types';
import { IssueState } from '../types/issue.types';

const initialState = {
  address: '',
  issuePeriod: 86400
};

export const issueReducer = (state: IssueState = initialState, action: IssueActions): IssueState => {
  switch (action.type) {
  case UPDATE_ISSUE_PERIOD: {
    return { ...state, issuePeriod: action.period };
  }
  default:
    return state;
  }
};
