import {
  UPDATE_ISSUE_PERIOD,
  UpdateIssuePeriod
} from '../types/actions.types';

export const updateIssuePeriodAction = (period: number): UpdateIssuePeriod => ({
  type: UPDATE_ISSUE_PERIOD,
  period
});
