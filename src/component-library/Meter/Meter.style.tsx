import styled from 'styled-components';

import { theme } from '../theme';

const StyledWrapper = styled.div`
  padding-top: 8px;
  padding-bottom: 36px;
`;

type MeterProps = {
  $width: number;
};

const StyledMeter = styled.div<MeterProps>`
  position: relative;
  height: ${theme.score.bar.height};
  background: ${theme.score.bar.bg};
  border-radius: ${theme.score.bar.radius};

  &::before {
    content: '';
    position: absolute;
    width: 50%;
    top: -8px;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 1px dashed ${theme.score.bar.separator.color};
    border-right: 1px dashed ${theme.score.bar.separator.color};
    z-index: 1;
  }

  &:after {
    content: '';
    width: 0;
    height: 0;
    border-left: ${theme.score.bar.indicator.border.left};
    border-right: ${theme.score.bar.indicator.border.right};
    border-bottom: ${theme.score.bar.indicator.border.bottom};
    position: absolute;
    left: ${(props) => props.$width}%;
    top: 100%;
    transform: translate(-50%);
    transition: left ${theme.transition.duration}ms;
    will-change: left;
    margin-top: 16px;
  }
`;

export { StyledMeter, StyledWrapper };
