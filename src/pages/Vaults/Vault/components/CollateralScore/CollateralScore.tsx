import { useMeter } from '@react-aria/meter';
import { HTMLAttributes, ReactNode } from 'react';

import { CollateralStatus, CollateralStatusRanges } from '../../types';
import { getCollateralStatus } from '../../utils';
import {
  StyledBar,
  StyledLabel,
  StyledLabelWrapper,
  StyledScore,
  StyledScoreWrapper,
  StyledSublabel,
  StyledWrapper
} from './CollateralScore.style';

const formatOptions: Intl.NumberFormatOptions = { style: 'decimal', maximumFractionDigits: 2 };

const getBarPercentage = (status: CollateralStatus, value: number, ranges: CollateralStatusRanges): number => {
  // We need the percentage against each segment range and we get by
  // subtracting the start of segment from the current value
  const segmentValue = (value > ranges[status].max ? ranges[status].max : value) - ranges[status].min;

  // Same approach but now for the max value
  const segmentMaxValue = ranges[status].max - ranges[status].min;

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

type Props = {
  ranges: CollateralStatusRanges;
  variant?: 'default' | 'highlight';
  score?: number;
  label?: ReactNode;
  sublabel?: ReactNode;
  infinity?: boolean;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type CollateralScoreProps = Props & NativeAttrs;

const CollateralScore = ({
  score = 0,
  label,
  sublabel,
  variant = 'default',
  ranges,
  infinity = false,
  ...props
}: CollateralScoreProps): JSX.Element => {
  // Makes sure we always have the correct aria-valuemax
  const maxValue = !infinity && score > ranges.success.max ? score : ranges.success.max;

  const { meterProps, labelProps } = useMeter({
    minValue: ranges.error.min,
    maxValue,
    value: infinity ? maxValue : score,
    formatOptions,
    label,
    ...props
  });

  // Does not allow negative numbers
  const value = meterProps['aria-valuenow'] || 0;
  const status = getCollateralStatus(value, ranges, infinity);
  const barPercentage = getBarPercentage(status, value, ranges);

  const isDefault = variant === 'default';

  return (
    <StyledWrapper {...meterProps} {...props}>
      <StyledLabelWrapper isDefault={isDefault}>
        <StyledLabel {...labelProps} isDefault={isDefault}>
          {label}
        </StyledLabel>
        <StyledScoreWrapper isDefault={isDefault}>
          <StyledScore isDefault={isDefault} status={status}>
            {infinity ? '∞' : `${meterProps['aria-valuetext']}%`}
          </StyledScore>
          <StyledSublabel isDefault={isDefault} status={isDefault ? status : undefined}>
            {sublabel}
          </StyledSublabel>
        </StyledScoreWrapper>
      </StyledLabelWrapper>
      <StyledBar width={barPercentage} />
    </StyledWrapper>
  );
};

export { CollateralScore };
export type { CollateralScoreProps };
