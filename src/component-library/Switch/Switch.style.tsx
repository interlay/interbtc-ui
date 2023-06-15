import styled from 'styled-components';

import { Span } from '../Text';
import { theme } from '../theme';

type StyledWrapperProps = {
  $reverse?: boolean;
};

const StyledWrapper = styled.label<StyledWrapperProps>`
  display: inline-flex;
  flex-direction: ${({ $reverse }) => $reverse && 'row-reverse'};
  align-items: center;
  position: relative;
  min-height: ${theme.spacing.spacing8};
  gap: ${theme.spacing.spacing2};
`;

const StyledInput = styled.input`
  width: 100%;
  height: 100%;
  opacity: 0.0001;
  z-index: 1;
  cursor: pointer;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
  left: 0;
`;

type StyledSwitchProps = {
  $isFocusVisible: boolean;
  $isChecked?: boolean;
};

const StyledSwitch = styled.span<StyledSwitchProps>`
  flex-grow: 0;
  flex-shrink: 0;
  display: inline-block;
  position: relative;
  width: ${theme.spacing.spacing10};
  height: ${theme.spacing.spacing6};
  border-radius: ${theme.rounded.full};
  margin: ${theme.spacing.spacing1} 0;
  background-color: ${({ $isChecked }) => ($isChecked ? theme.switch.checked.bg : theme.switch.unchecked.bg)};
  transition: ${theme.transition.default};
  outline: ${({ $isFocusVisible }) => $isFocusVisible && theme.outline.default};
  outline-offset: 2px;

  &::before {
    content: '';
    box-sizing: border-box;
    display: block;
    background-color: ${theme.switch.indicator.bg};
    position: absolute;
    width: calc(${theme.spacing.spacing6} * 0.7);
    height: calc(${theme.spacing.spacing6} * 0.7);
    top: calc(50% - ${theme.spacing.spacing6} * 0.35);
    left: 0;
    border-radius: ${theme.rounded.full};
    transition: transform ${theme.transition.duration.duration250}ms ease 0s;
    transform: ${({ $isChecked }) =>
      $isChecked
        ? `translateX(calc(${theme.spacing.spacing10} - ${theme.spacing.spacing10} / 15 - ${theme.spacing.spacing6} * 0.7))`
        : `translateX(calc(${theme.spacing.spacing10} / 15))`};
  }
`;

const StyledLabel = styled(Span)`
  text-align: left;
`;

export { StyledInput, StyledLabel, StyledSwitch, StyledWrapper };
