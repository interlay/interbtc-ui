import { Status } from '../utils/prop-types';
import { MeterRanges } from './Meter';

const getRangeIndex = (status: Status): number => {
  switch (status) {
    case 'error':
      return 1;
    case 'warning':
      return 2;
    case 'success':
      return 3;
  }
};

const getReverseRangeIndex = (status: Status): number => {
  switch (status) {
    case 'error':
      return 2;
    case 'warning':
      return 1;
    case 'success':
      return 0;
  }
};

const getMaxRange = (ranges: MeterRanges, status: Status, reverse?: boolean): number =>
  reverse ? ranges[getReverseRangeIndex(status)] : ranges[getRangeIndex(status)];

/**
 * @param {number} value - meter value.
 * @param {MeterRanges} ranges - meter ranges.
 * @param {boolean} reverse - ranges with reverse [min-success, success, min-warning, min-error]
 * and without [min-error, max-error, max-warning, max-error].
 * @return {Status} - the current status of the meter: error | warning | success
 */
const getStatus = (value: number, ranges: MeterRanges, reverse?: boolean): Status => {
  if (reverse ? value >= getMaxRange(ranges, 'error', reverse) : value <= getMaxRange(ranges, 'error', reverse)) {
    return 'error';
  }

  if (reverse ? value >= getMaxRange(ranges, 'warning', reverse) : value <= getMaxRange(ranges, 'warning', reverse)) {
    return 'warning';
  }

  return 'success';
};

const getBarPercentage = (value: number, ranges: MeterRanges, status?: Status): number => {
  if (!status) return 0;

  const currentMaxRange = getMaxRange(ranges, status);
  const currentRangeIndex = getRangeIndex(status);
  const previousMaxRange = ranges[currentRangeIndex - 1];

  // We need the percentage against each segment range and we get by
  // subtracting the start of segment from the current value
  const segmentValue = (value > currentMaxRange ? currentMaxRange : value) - previousMaxRange;

  // Same approach but now for the max value
  const segmentMaxValue = currentMaxRange - previousMaxRange;

  // We calculate against the percentage that each segment occupies from the parent
  switch (status) {
    case 'error':
      return (segmentValue / segmentMaxValue) * 25;
    case 'warning':
      // error + (current segment percentage)
      return 25 + (segmentValue / segmentMaxValue) * 50;
    case 'success':
      // error + warning + (current segment percentage)
      return 75 + (segmentValue / segmentMaxValue) * 25;
  }
};

export { getBarPercentage, getMaxRange, getRangeIndex, getReverseRangeIndex, getStatus };
