import { useRef } from 'react';

import { MeterRanges } from './Meter';
import { StyledRangeIndicator } from './Meter.style';
import { getMaxRange } from './utils';

type RangeIndicatorsProps = {
  ranges: MeterRanges;
};

const RangeIndicators = ({ ranges }: RangeIndicatorsProps): JSX.Element => {
  const warningRef = useRef<HTMLSpanElement>(null);
  const errorRef = useRef<HTMLSpanElement>(null);

  const warning = getMaxRange(ranges, 'warning', true);
  const error = getMaxRange(ranges, 'error', true);

  const distance =
    (errorRef.current?.getBoundingClientRect().left || 0) - (warningRef.current?.getBoundingClientRect().left || 0);

  const warningLength = warning.toString().length;
  const errorLength = error.toString().length;

  let hasOffset = false;

  if (warningLength <= 2 && errorLength <= 2) {
    hasOffset = distance < 26;
  } else if ((warningLength <= 2 && errorLength >= 3) || (warningLength >= 3 && errorLength <= 2)) {
    hasOffset = distance < 30;
  } else {
    hasOffset = distance < 45;
  }

  return (
    <>
      <StyledRangeIndicator ref={warningRef} $hasOffset={hasOffset} $position={warning} $status='warning' />
      <StyledRangeIndicator ref={errorRef} $hasOffset={hasOffset} $position={error} $status='error' />
    </>
  );
};

export { RangeIndicators };
export type { RangeIndicatorsProps };
