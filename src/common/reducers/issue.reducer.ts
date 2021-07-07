import {
  RESET_ISSUE_WIZARD,
  CHANGE_ISSUE_ID,
  CHANGE_ADDRESS,
  ADD_ISSUE_REQUEST,
  UPDATE_ISSUE_REQUEST,
  IssueActions,
  UPDATE_ALL_ISSUE_REQUESTS,
  UPDATE_ISSUE_PERIOD
} from '../types/actions.types';
import { IssueState } from '../types/issue.types';

const initialState = {
  address: '',
  id: '',
  issueRequests: new Map(),
  issuePeriod: 86400
};

export const issueReducer = (state: IssueState = initialState, action: IssueActions): IssueState => {
  switch (action.type) {
  case CHANGE_ADDRESS:
    return { ...state, address: action.address };
  case CHANGE_ISSUE_ID:
    return { ...state, id: action.id };
  case RESET_ISSUE_WIZARD: {
    const newState = {
      ...initialState,
      address: state.address,
      issueRequests: state.issueRequests
    };
    return newState;
  }
  case ADD_ISSUE_REQUEST: {
    const newMap = new Map(state.issueRequests);
    const requests = state.issueRequests.get(state.address);
    if (requests) {
      newMap.set(state.address, [...requests, action.request]);
    } else {
      newMap.set(state.address, [action.request]);
    }
    return { ...state, issueRequests: newMap };
  }
  case UPDATE_ISSUE_REQUEST: {
    const map = new Map(state.issueRequests);
    const reqs = state.issueRequests.get(state.address);
    if (!reqs) return state;
    const updateRequests = reqs.map(request => {
      if (action.request.id === request.id) return action.request;
      else return request;
    });
    map.set(state.address, updateRequests);
    return { ...state, issueRequests: map };
  }
  // ray test touch <
  case UPDATE_ALL_ISSUE_REQUESTS: {
    const newRequests = new Map(state.issueRequests);
    newRequests.set(action.userDotAddress, action.issueRequests);
    return { ...state, issueRequests: newRequests };
  }
  // ray test touch >
  case UPDATE_ISSUE_PERIOD: {
    return { ...state, issuePeriod: action.period };
  }
  default:
    return state;
  }
};
