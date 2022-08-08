import { useMeter } from '@react-aria/meter';
import { HTMLAttributes, ReactNode } from 'react';

import { Status } from '../utils/prop-types';
import {
  StyledBar,
  StyledLabel,
  StyledLabelWrapper,
  StyledScore,
  StyledScoreWrapper,
  StyledSegment,
  StyledSublabel
} from './CollateralScore.style';

type StatusRanges = Record<Status, { min: number; max: number }>;

const segmentPercentage = 33.33;

const formatOptions: Intl.NumberFormatOptions = { style: 'decimal', maximumFractionDigits: 2 };

const getStatus = (value: number, ranges: StatusRanges): Status => {
  if (value <= ranges['error'].max) return 'error';
  if (value <= ranges['warning'].max) return 'warning';
  return 'success';
};

const getBarPercentage = (status: Status, value: number, ranges: StatusRanges): number => {
  // We need the percentage against each segment range and we get by
  // subtracting the start of segment from the current value
  const segmentValue = (value > ranges[status].max ? ranges[status].max : value) - ranges[status].min;

  // Same approach but now for the max value
  const segmentMaxValue = ranges[status].max - ranges[status].min;

  // We calculate against the percentage that each segment occupies from the parent
  const rangePercentage = (segmentValue / segmentMaxValue) * segmentPercentage;

  switch (status) {
    case 'error':
      return rangePercentage;
    case 'warning':
      // 33.33 + (current segment percentage)
      return segmentPercentage + rangePercentage;
    case 'success':
      // 66.66 + (current segment percentage)
      return segmentPercentage * 2 + rangePercentage;
  }
};

type Props = {
  ranges: StatusRanges;
  variant?: 'default' | 'highlight';
  score?: number;
  label?: ReactNode;
  sublabel?: ReactNode;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type CollateralScoreProps = Props & NativeAttrs;

const CollateralScore = ({
  score = 0,
  label,
  sublabel,
  variant = 'default',
  ranges,
  ...props
}: CollateralScoreProps): JSX.Element => {
  // Makes sure we always have the correct aria-valuemax
  const maxValue = score > ranges.success.max ? score : ranges.success.max;

  const { meterProps, labelProps } = useMeter({
    minValue: ranges.error.min,
    maxValue,
    value: score,
    formatOptions,
    label,
    ...props
  });

  // Does not allow negative numbers
  const value = meterProps['aria-valuenow'] || 0;
  const status = getStatus(value, ranges);
  const barPercentage = getBarPercentage(status, value, ranges);

  const isDefault = variant === 'default';

  return (
    <div {...meterProps}>
      <StyledLabelWrapper isDefault={isDefault}>
        <StyledLabel {...labelProps} isDefault={isDefault}>
          {label}
        </StyledLabel>
        <StyledScoreWrapper isDefault={isDefault}>
          <StyledScore isDefault={isDefault} status={status}>
            {meterProps['aria-valuetext']}%
          </StyledScore>
          <StyledSublabel isDefault={isDefault} status={isDefault ? status : undefined}>
            {sublabel}
          </StyledSublabel>
        </StyledScoreWrapper>
      </StyledLabelWrapper>
      <StyledBar width={barPercentage} {...props}>
        <StyledSegment status='error' />
        <StyledSegment status='warning' />
        <StyledSegment status='success' />
      </StyledBar>
    </div>
  );
};

export { CollateralScore };
export type { CollateralScoreProps };
