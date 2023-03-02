import styled from 'styled-components';

import { ChevronDown } from '@/assets/icons';

import { List } from '../List';
import { Span } from '../Text';
import { theme } from '../theme';
import { Sizes } from '../utils/prop-types';

type StyledTriggerProps = {
  $isOpen?: boolean;
  $isFocusVisible?: boolean;
  $size: Sizes;
  $isDisabled: boolean;
  $hasError: boolean;
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

  font-size: ${({ $size }) => theme.select.size[$size].text};
  line-height: ${theme.lineHeight.base};
  color: ${(props) => (props.disabled ? theme.input.disabled.color : theme.input.color)};
  background-color: ${theme.input.background};
  overflow: hidden;

  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  text-align: left;

  padding: ${({ $size }) => theme.select.size[$size].padding};
  cursor: pointer;
  max-height: ${({ $size }) => `calc(${theme.input[$size].maxHeight} - 1px)`};

  border: ${(props) =>
    props.$isDisabled
      ? theme.input.disabled.border
      : props.$hasError
      ? theme.input.error.border
      : theme.border.default};
  border-radius: ${theme.rounded.md};
  transition: border-color ${theme.transition.duration.duration150}ms ease-in-out,
    box-shadow ${theme.transition.duration.duration150}ms ease-in-out;

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

const StyledList = styled(List)`
  overflow: auto;
  padding: 0 ${theme.modal.body.paddingX} ${theme.modal.body.paddingY} ${theme.modal.body.paddingX};
`;

const StyledChevronDown = styled(ChevronDown)`
  margin-left: ${theme.spacing.spacing2};
`;

export { StyledChevronDown, StyledList, StyledTrigger, StyledTriggerValue };
