
// TODO: should use ISO 8601 standard instead of timestamp
const CHALLENGES_2_AND_3_START = 1615467600000; // Wed Mar 10 2021 16:00:00 GMT+0000
const CHALLENGE_4_WEEK_1_START = 1622631600000; // Wed Jun 02 2021 11:00:00 GMT+0000
const CHALLENGE_4_WEEK_2_START = 1623236400000; // Wed Jun 09 2021 11:00:00 GMT+0000
const CHALLENGES_ALL_TIME = 0;

const CHALLENGE_CUT_OFFS = Object.freeze({
  challenges4Week2Start: {
    id: 0,
    time: CHALLENGE_4_WEEK_2_START
  },
  challenges4Week1Start: {
    id: 1,
    time: CHALLENGE_4_WEEK_1_START
  },
  challenges2And3Start: {
    id: 2,
    time: CHALLENGES_2_AND_3_START
  },
  challengesAllTime: {
    id: 3,
    time: CHALLENGES_ALL_TIME
  }
});

export {
  CHALLENGE_CUT_OFFS
};
