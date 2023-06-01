import { AriaProgressBarProps, useProgressBar } from '@react-aria/progress';
import { CSSProperties } from 'react';

import { Flex, FlexProps } from '../Flex';
import { Span } from '../Text';
import { ProgressBarColors } from '../utils/prop-types';
import { StyledFill, StyledTrack } from './ProgressBar.style';

type Props = { color?: ProgressBarColors; showValueLabel?: boolean };

type AriaAttrs = Omit<AriaProgressBarProps, keyof Props>;

type InheritAttrs = Omit<FlexProps, keyof Props & AriaAttrs>;

type ProgressBarProps = Props & InheritAttrs & AriaAttrs;

const ProgressBar = (props: ProgressBarProps): JSX.Element => {
  const { progressBarProps, labelProps } = useProgressBar(props);

  const {
    value = 0,
    minValue = 0,
    maxValue = 100,
    color = 'default',
    showValueLabel,
    label,
    className,
    style,
    hidden
  } = props;

  const percentage = (value - minValue) / (maxValue - minValue);
  const barStyle: CSSProperties = { width: `${Math.round(percentage * 100)}%` };

  return (
    <Flex direction='column' gap='spacing3' className={className} style={style} hidden={hidden} {...progressBarProps}>
      {(label || showValueLabel) && (
        <Flex>
          {label && <Span {...labelProps}>{label}</Span>}
          {showValueLabel && <Span>{progressBarProps['aria-valuetext']}</Span>}
        </Flex>
      )}
      <StyledTrack>
        <StyledFill $color={color} style={barStyle} />
      </StyledTrack>
    </Flex>
  );
};

export { ProgressBar };
export type { ProgressBarProps };
