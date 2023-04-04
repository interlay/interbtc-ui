const SOME_VESTING_SCHEDULES = [{ start: 0, period: 0, periodCount: 1, perPeriod: 1 }];

const EMPTY_VESTING_SCHEDULES: any[] = [];

const mockVestingSchedules = jest.fn().mockReturnValue(EMPTY_VESTING_SCHEDULES);

const mockClaimVesting = jest.fn();

export { EMPTY_VESTING_SCHEDULES, mockClaimVesting, mockVestingSchedules, SOME_VESTING_SCHEDULES };
