
// TODO: should use ISO 8601 standard instead of timestamp
const CHALLENGES_2_AND_3_START = 1615467600000; // Wed Mar 10 2021 16:00:00 GMT+0000
const CHALLENGE_4_START = 1615816800000; // Mon Mar 15 2021 14:00:00 GMT+0000
const CHALLENGES_ALL_TIME = 0;

const CHALLENGE_CUT_OFFS = Object.freeze({
  challenges2And3Start: {
    id: 0,
    time: CHALLENGES_2_AND_3_START
  },
  challenges4Start: {
    id: 1,
    time: CHALLENGE_4_START
  },
  challengesAllTime: {
    id: 2,
    time: CHALLENGES_ALL_TIME
  }
});

export {
  CHALLENGE_CUT_OFFS
};
