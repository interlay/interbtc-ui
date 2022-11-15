import { HTMLAttributes, useEffect, useState } from 'react';

import { Status } from '../utils/prop-types';
import { StyledIndicator, StyledMeter, StyledWrapper } from './Meter.style';

// [min-error (0), max-error, max-warning, max-success]
type MeterRanges = [number, number, number, number];

const getRangeIndex = (status: Status) => {
  switch (status) {
    case 'error':
      return 1;
    case 'warning':
      return 2;
    case 'success':
      return 3;
  }
};

const getMaxRange = (ranges: MeterRanges, status: Status): number => ranges[getRangeIndex(status)];

const getStatus = (value: number, ranges: MeterRanges): Status => {
  if (value <= getMaxRange(ranges, 'error')) return 'error';
  if (value <= getMaxRange(ranges, 'warning')) return 'warning';
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

const getWidth = (percentage: number) => (percentage > 100 ? 100 : percentage < 0 ? 0 : percentage);

type Props = {
  value: number;
  ranges: MeterRanges;
  onChange?: (status: Status) => void;
  showRanges?: boolean;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type MeterProps = Props & NativeAttrs;

const Meter = ({ value = 0, ranges, onChange, showRanges, ...props }: MeterProps): JSX.Element => {
  const [status, setStatus] = useState<Status>();
  const percentage = getBarPercentage(value, ranges, status);
  const width = getWidth(percentage);
  const [min, error, warning, max] = ranges;

  useEffect(() => {
    const newStatus = getStatus(value, ranges);

    if (newStatus !== status) {
      setStatus(newStatus);
      onChange?.(newStatus);
    }
  }, [onChange, ranges, status, value]);

  return (
    <StyledWrapper $showRanges={showRanges}>
      <StyledMeter $width={width} $hasIndicator={!!status} {...props} />
      {showRanges && (
        <>
          <StyledIndicator $variant='min'>{min}</StyledIndicator>
          <StyledIndicator $variant='warning'>{error}</StyledIndicator>
          <StyledIndicator $variant='error'>{warning}</StyledIndicator>
          <StyledIndicator $variant='max'>{max}</StyledIndicator>
        </>
      )}
    </StyledWrapper>
  );
};

export { Meter };
export type { MeterProps, MeterRanges };
