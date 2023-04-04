import styled from 'styled-components';

import { Span } from '../Text';
import { theme } from '../theme';
import { Sizes } from '../utils/prop-types';

type StyledTriggerProps = {
  $isOpen?: boolean;
  $isFocusVisible?: boolean;
  $size: Sizes;
  $isDisabled?: boolean;
  $hasError?: boolean;
};

type StyledTriggerValueProps = {
  $isDisabled?: boolean;
  $isSelected?: boolean;
};

const StyledTrigger = styled.button<StyledTriggerProps>`
  outline: none;
  font: inherit;
  letter-spacing: inherit;
  background: none;
  appearance: none;

  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  text-align: left;
  // TODO: figure out this z-index when select is fully added
  z-index: 1000;

  font-size: ${({ $size }) => theme.select.size[$size].text};
  line-height: ${theme.lineHeight.base};

  // Inherited from Input styled
  color: ${(props) => (props.disabled ? theme.input.disabled.color : theme.input.color)};
  border: ${(props) =>
    props.$isDisabled
      ? theme.input.disabled.border
      : props.$hasError
      ? theme.input.error.border
      : theme.border.default};
  background-color: ${theme.input.background};

  max-height: calc(${theme.spacing.spacing16} - 1px);

  overflow: hidden;

  border-radius: ${theme.rounded.md};
  transition: border-color ${theme.transition.duration.duration150}ms ease-in-out,
    box-shadow ${theme.transition.duration.duration150}ms ease-in-out;
  padding: ${({ $size }) => theme.select.size[$size].padding};

  cursor: pointer;

  &:hover:not(:disabled):not(:focus) {
    border: ${(props) => !props.$isDisabled && !props.$hasError && theme.input.hover.border};
  }

  &:focus {
    border: ${(props) => !props.$isDisabled && theme.input.focus.border};
    box-shadow: ${(props) => !props.$isDisabled && theme.input.focus.boxShadow};
  }
`;

const StyledTriggerValue = styled(Span)<StyledTriggerValueProps>`
  display: inline-flex;
  align-items: center;
  color: ${({ $isDisabled, $isSelected }) =>
    $isDisabled ? theme.input.disabled.color : $isSelected ? theme.select.color : theme.select.placeholder};
`;

export { StyledTrigger, StyledTriggerValue };
