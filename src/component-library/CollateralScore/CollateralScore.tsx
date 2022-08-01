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

const formatOptions: Intl.NumberFormatOptions = { style: 'decimal', maximumFractionDigits: 2 };

const getSeverity = (percentage: number): Severity => {
  if (percentage <= 33) return 'error';
  if (percentage <= 66) return 'warning';
  return 'success';
};

type Props = {
  variant?: 'default' | 'highlight';
  score?: number;
  minScore?: number;
  maxScore?: number;
  label?: ReactNode;
  sublabel?: ReactNode;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type CollateralScoreProps = Props & NativeAttrs;

const CollateralScore = ({
  score = 0,
  minScore = 0,
  maxScore = 100,
  label,
  sublabel,
  variant = 'default',
  ...props
}: CollateralScoreProps): JSX.Element => {
  // There is only a max visually for the bar, since our score
  // can overexceed the max score since a vault can be over-collateralised.
  const maxValue = score > maxScore ? score : maxScore;

  const { meterProps, labelProps } = useMeter({
    minValue: minScore,
    maxValue,
    value: score,
    formatOptions,
    label,
    ...props
  });

  const value = meterProps['aria-valuenow'] || 0;
  const barPercentage = Math.round((value / maxValue) * 100);
  const severity: Severity = getSeverity(barPercentage);

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
