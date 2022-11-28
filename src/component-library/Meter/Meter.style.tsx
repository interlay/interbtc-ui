import styled, { css } from 'styled-components';

import { Flex } from '../Flex';
import { Span } from '../Text';
import { theme } from '../theme';
import { Status, Variants } from '../utils/prop-types';

type StyledWrapperProps = {
  $variant: Variants;
};

type StyledMeterProps = {
  $position: number;
  $variant: Variants;
};

type StyledRangeIndicatorProps = {
  $position: number;
  $status: Exclude<Status, 'success'>;
};

const StyledWrapper = styled.div<StyledWrapperProps>`
  position: relative;
  padding-top: ${({ $variant }) => ($variant === 'secondary' ? theme.spacing.spacing5 : '8px')};
  padding-bottom: 36px;
  width: 100%;
`;

const StyledMeter = styled.div<StyledMeterProps>`
  position: relative;
  height: ${theme.meter.bar.height};
  background: ${({ $variant }) => theme.meter.bar[$variant].bg};
  border-radius: ${theme.meter.bar.radius};

  // Progress bar for secondary Meter
  ${({ $variant, $position }) =>
    $variant === 'secondary' &&
    css`
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        height: 100%;
        right: calc(100% - ${$position}%);
        background-color: ${theme.meter.bar.indicator.color};
        border-radius: inherit;
        transition: right ${theme.transition.duration.duration100}ms;
        will-change: right;
      }
    `}

  // Ranges indicators for primary meter
  ${({ $variant }) =>
    $variant === 'primary' &&
    css`
      &::before {
        content: '';
        position: absolute;
        // need for a correct placement
        width: calc(50% - 1px);
        top: -8px;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 1px dashed ${theme.meter.bar.separator.color};
        border-right: 1px dashed ${theme.meter.bar.separator.color};
        z-index: 1;
      }
    `}
`;

const StyledContainer = styled.div`
  position: relative;
`;

const StyledIndicatorWrapper = styled(Flex)<StyledMeterProps>`
  position: absolute;
  left: ${({ $position }) => $position}%;
  top: 100%;
  transform: translateX(-50%);
  transition: left ${theme.transition.duration.duration100}ms;
  will-change: left;
  margin-top: ${({ $variant }) => theme.meter.bar.indicator[$variant].marginTop};
  color: ${theme.meter.bar.indicator.color};
  font-size: ${theme.text.xs};
  font-weight: ${theme.fontWeight.bold};
`;

const StyledRangeIndicator = styled(Span)<StyledRangeIndicatorProps>`
  position: absolute;
  width: 0;
  top: -2px;
  bottom: -2px;
  left: ${({ $position }) => $position}%;
  transform: translateX(-50%);
  border: 2px solid ${({ $status }) => theme.alert.status[$status]};
  border-radius: ${theme.rounded.full};
  z-index: 1;

  &::after {
    content: '${({ $position }) => $position}%';
    position: absolute;
    transform: translate(-45%, -120%);
    font-size: ${theme.text.xs};
    font-weight: ${theme.fontWeight.bold};
  }
`;

export { StyledContainer, StyledIndicatorWrapper, StyledMeter, StyledRangeIndicator, StyledWrapper };
