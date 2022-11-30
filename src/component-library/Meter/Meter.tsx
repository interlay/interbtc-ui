import { HTMLAttributes, useEffect, useState } from 'react';

import { Span } from '../Text';
import { Status, Variants } from '../utils/prop-types';
import { Indicator } from './Indicator';
import {
  StyledContainer,
  StyledIndicatorWrapper,
  StyledMeter,
  StyledRangeIndicator,
  StyledWrapper
} from './Meter.style';
import { getBarPercentage, getMaxRange, getStatus } from './utils';

const getPosition = (percentage: number) => (percentage > 100 ? 100 : percentage < 0 ? 0 : percentage);

type MeterRanges = [number, number, number, number];

type Props = {
  variant?: Variants;
  value?: number;
  ranges?: MeterRanges;
  showIndicator?: boolean;
  showValue?: boolean;
  onChange?: (status: Status) => void;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type MeterProps = Props & NativeAttrs;

const Meter = ({
  value = 0,
  ranges,
  onChange,
  variant = 'primary',
  className,
  style,
  hidden,
  ...props
}: MeterProps): JSX.Element => {
  const [status, setStatus] = useState<Status>();
  const isPrimary = variant === 'primary';
  const positionValue = isPrimary ? getBarPercentage(value, ranges, status) : value;
  const position = getPosition(positionValue);
  const hasRanges = !!ranges;

  useEffect(() => {
    const newStatus = getStatus(value, ranges, !isPrimary);

    if (!!newStatus && newStatus !== status) {
      setStatus(newStatus);
      onChange?.(newStatus);
    }
  }, [isPrimary, onChange, ranges, status, value, variant]);

  return (
    <StyledWrapper $variant={variant} className={className} style={style} hidden={hidden}>
      <StyledContainer>
        <StyledMeter $hasRanges={hasRanges} $position={position} $variant={variant} {...props} />
        <StyledIndicatorWrapper
          direction='column'
          justifyContent='center'
          alignItems='center'
          gap='spacing1'
          $position={position}
          $variant={variant}
        >
          <Indicator />
          {!isPrimary && <Span>{position}%</Span>}
        </StyledIndicatorWrapper>
        {!isPrimary && hasRanges && (
          <>
            <StyledRangeIndicator $position={getMaxRange(ranges, 'warning', true)} $status='warning' />
            <StyledRangeIndicator $position={getMaxRange(ranges, 'error', true)} $status='error' />
          </>
        )}
      </StyledContainer>
    </StyledWrapper>
  );
};

export { Meter };
export type { MeterProps, MeterRanges };
