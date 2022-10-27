import styled from 'styled-components';

import { theme } from '../theme';

const StyledWrapper = styled.div`
  padding-top: 8px;
  padding-bottom: 36px;
  width: 100%;
`;

type MeterProps = {
  $width: number;
  $hasIndicator: boolean;
};

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
          transition: left ${theme.transition.duration}ms;
          will-change: left;
          margin-top: 16px;
        }`;
    }
  }}
`;

export { StyledMeter, StyledWrapper };
