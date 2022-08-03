import { useMeter } from '@react-aria/meter';
import { HTMLAttributes, ReactNode } from 'react';

import { Severity } from '../utils/prop-types';
import {
  StyledBar,
  StyledLabel,
  StyledLabelWrapper,
  StyledScore,
  StyledScoreWrapper,
  StyledSegment,
  StyledSublabel
} from './CollateralScore.style';

type Ranges = Record<Severity, { min: number; max: number }>;

const segmentPercentage = 33.33;

const defaultRanges: Ranges = {
  error: { min: 0, max: segmentPercentage },
  warning: { min: 33.34, max: 66.66 },
  success: { min: 66.67, max: 100 }
};

const formatOptions: Intl.NumberFormatOptions = { style: 'decimal', maximumFractionDigits: 2 };

const getSeverity = (value: number, ranges: Ranges): Severity => {
  if (value <= ranges['error'].max) return 'error';
  if (value <= ranges['warning'].max) return 'warning';
  return 'success';
};

const getBarPercentage = (severity: Severity, value: number, ranges: Ranges): number => {
  // We need the percentage against each segment range and we get by
  // subtracting the start of segment from the current value
  const segmentValue = (value > ranges.success.max ? ranges.success.max : value) - ranges[severity].min;

  // Same approach but now for the max value
  const segmentMaxValue = ranges[severity].max - ranges[severity].min;

  // We calculate against the percentage that each segment occupies from the parent
  const rangePercentage = (segmentValue / segmentMaxValue) * segmentPercentage;

  switch (severity) {
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
  variant?: 'default' | 'highlight';
  score?: number;
  label?: ReactNode;
  sublabel?: ReactNode;
  ranges?: Ranges;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type CollateralScoreProps = Props & NativeAttrs;

const CollateralScore = ({
  score = 0,
  label,
  sublabel,
  variant = 'default',
  ranges = defaultRanges,
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
  const severity: Severity = getSeverity(value, ranges);
  const barPercentage = getBarPercentage(severity, value, ranges);

  const isDefault = variant === 'default';

  return (
    <div {...meterProps}>
      <StyledLabelWrapper isDefault={isDefault}>
        <StyledLabel {...labelProps} isDefault={isDefault}>
          {label}
        </StyledLabel>
        <StyledScoreWrapper isDefault={isDefault}>
          <StyledScore isDefault={isDefault} severity={severity}>
            {meterProps['aria-valuetext']}%
          </StyledScore>
          <StyledSublabel isDefault={isDefault} severity={isDefault ? severity : undefined}>
            {sublabel}
          </StyledSublabel>
        </StyledScoreWrapper>
      </StyledLabelWrapper>
      <StyledBar width={barPercentage} {...props}>
        <StyledSegment severity='error' />
        <StyledSegment severity='warning' />
        <StyledSegment severity='success' />
      </StyledBar>
    </div>
  );
};

export { CollateralScore };
export type { CollateralScoreProps };
