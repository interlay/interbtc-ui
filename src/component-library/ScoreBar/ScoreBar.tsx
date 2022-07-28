import { useMeter } from '@react-aria/meter';
import { HTMLAttributes, ReactNode } from 'react';

import {
  StyledBar,
  StyledLabel,
  StyledLabelWrapper,
  StyledScore,
  StyledScoreWrapper,
  StyledSegment,
  StyledSublabel
} from './ScoreBar.style';

const formatOptions: Intl.NumberFormatOptions = { style: 'decimal', maximumFractionDigits: 2 };

type Props = {
  variant?: 'default' | 'highlight';
  score?: number;
  minScore?: number;
  maxScore?: number;
  label?: ReactNode;
  sublabel?: ReactNode;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type ScoreBarProps = Props & NativeAttrs;

const ScoreBar = ({
  score = 0,
  minScore = 0,
  maxScore = 100,
  label,
  sublabel,
  variant = 'default',
  ...props
}: ScoreBarProps): JSX.Element => {
  const { meterProps, labelProps } = useMeter({
    minValue: minScore,
    maxValue: maxScore,
    value: score,
    formatOptions,
    ...props
  });
  const value = meterProps['aria-valuenow'] || 0;
  const percentage = Math.round((value / maxScore) * 100);
  const severity = percentage <= 33 ? 'error' : percentage <= 66 ? 'warning' : 'success';

  const isDefault = variant === 'default';

  // TODO: change file name

  return (
    <div {...meterProps}>
      <StyledLabelWrapper isRow={isDefault}>
        <StyledLabel {...labelProps}>{label}</StyledLabel>
        <StyledScoreWrapper isRow={isDefault}>
          <StyledScore severity={severity}>{meterProps['aria-valuetext']}%</StyledScore>
          <StyledSublabel severity={isDefault ? severity : undefined}>{sublabel}</StyledSublabel>
        </StyledScoreWrapper>
      </StyledLabelWrapper>
      <StyledBar score={percentage} {...props}>
        <StyledSegment severity='error' />
        <StyledSegment severity='warning' />
        <StyledSegment severity='success' />
      </StyledBar>
    </div>
  );
};

export { ScoreBar };
export type { ScoreBarProps };
