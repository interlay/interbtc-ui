import styled from 'styled-components';

import { Span } from '../Text';
import { theme } from '../theme';

type StyledWrapperProps = {
  $showRanges?: boolean;
};

type StyledIndicatorProps = {
  $variant: 'min' | 'error' | 'warning' | 'max';
};

type MeterProps = {
  $width: number;
  $hasIndicator: boolean;
};

const StyledWrapper = styled.div<StyledWrapperProps>`
  position: relative;
  padding-top: ${({ $showRanges }) => ($showRanges ? theme.spacing.spacing8 : '8px')};
  padding-bottom: 36px;
  width: 100%;
`;

const StyledIndicator = styled(Span)<StyledIndicatorProps>`
  position: absolute;
  left: ${({ $variant }) => {
    switch ($variant) {
      case 'min':
        return 0;
      case 'warning':
        return '25%';
      case 'error':
        return '75%';
      default:
        return;
    }
  }};
  right: ${({ $variant }) => {
    switch ($variant) {
      case 'max':
        return '0';
      default:
        return;
    }
  }};
  transform: ${({ $variant }) => {
    switch ($variant) {
      case 'warning':
        return 'translateX(-50%)';
      case 'error':
        return 'translateX(-50%)';
      default:
        return;
    }
  }};

  top: ${theme.spacing.spacing1};
  font-size: ${theme.text.xs};
  font-weight: ${theme.fontWeight.medium};
`;

const StyledMeter = styled.div<MeterProps>`
  position: relative;
  height: ${theme.meter.bar.height};
  background: ${theme.meter.bar.bg};
  border-radius: ${theme.meter.bar.radius};

  &::before {
    content: '';
    position: absolute;
    width: 50%;
    top: -8px;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 1px dashed ${theme.meter.bar.separator.color};
    border-right: 1px dashed ${theme.meter.bar.separator.color};
    z-index: 1;
  }

  ${({ $hasIndicator, $width }) => {
    if ($hasIndicator) {
      return `       
        &:after {
          content: '';
          width: 0;
          height: 0;
          border-left: ${theme.meter.bar.indicator.border.left};
          border-right: ${theme.meter.bar.indicator.border.right};
          border-bottom: ${theme.meter.bar.indicator.border.bottom};
          position: absolute;
          left: ${$width}%;
          top: 100%;
          transform: translate(-50%);
          transition: left ${theme.transition.duration.duration100}ms;
          will-change: left;
          margin-top: 16px;
        }`;
    }
  }}
`;

export { StyledIndicator, StyledMeter, StyledWrapper };
