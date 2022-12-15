import styled from 'styled-components';

import { theme } from '../theme';
import { Placement, Sizes } from '../utils/prop-types';

type BaseInputProps = {
  $size: Sizes;
  $hasBottomAdornment?: boolean;
  $hasRightAdornment?: boolean;
  $endAdornmentSize?: Sizes | 'extra-large';
  $hasLeftAdornment?: boolean;
  $isDisabled?: boolean;
  $hasError?: boolean;
};

type AdornmentProps = {
  $position: Placement;
};

const StyledBaseInput = styled.input<BaseInputProps>`
  display: block;
  width: 100%;
  height: 100%;
  line-height: ${theme.lineHeight.base};
  padding-top: ${theme.spacing.spacing2};
  padding-left: ${({ $hasLeftAdornment }) => ($hasLeftAdornment ? '4rem' : theme.spacing.spacing2)};
  padding-right: ${({ $endAdornmentSize }) => {
    switch ($endAdornmentSize) {
      case 'extra-large':
        return '7.75rem';
      case 'large':
        return '6rem';
      case 'medium':
      default:
        return theme.spacing.spacing2;
      case 'small':
        return theme.spacing.spacing1;
    }
  }};
  padding-bottom: ${({ $hasBottomAdornment }) =>
    $hasBottomAdornment ? theme.spacing.spacing6 : theme.spacing.spacing2};
  outline: none;
  font: inherit;
  letter-spacing: inherit;
  background: none;
  color: ${(props) => (props.disabled ? theme.input.disabled.color : theme.input.color)};
  font-size: ${({ $size, $hasBottomAdornment }) =>
    $hasBottomAdornment ? theme.input.overflow.large.text : theme.input[$size].text};
  background-color: ${theme.input.background};
  border-radius: ${theme.rounded.md};
  overflow: hidden;
  border: ${(props) =>
    props.$isDisabled
      ? theme.input.disabled.border
      : props.$hasError
      ? theme.input.error.border
      : theme.border.default};
  transition: border-color ${theme.transition.duration.duration150}ms ease-in-out,
    box-shadow ${theme.transition.duration.duration150}ms ease-in-out;

  &:hover {
    border: ${(props) => !props.$isDisabled && !props.$hasError && theme.input.hover.border};
  }

  &:focus {
    border: ${(props) => !props.$isDisabled && theme.input.focus.border};
    box-shadow: ${(props) => !props.$isDisabled && theme.input.focus.boxShadow};
  }

  &::placeholder {
    color: ${(props) => (props.disabled ? theme.input.disabled.color : theme.colors.textTertiary)};
  }

  /* MEMO: inspired by https://www.w3schools.com/howto/howto_css_hide_arrow_number.asp */
  /* Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type='number'] {
    -moz-appearance: textfield;
  }
`;

const BaseInputWrapper = styled.div`
  position: relative;
  color: ${theme.colors.textPrimary};
  box-sizing: border-box;
  display: flex;
  align-items: center;
`;

const Adornment = styled.div<AdornmentProps>`
  display: inline-flex;
  align-items: center;
  position: absolute;
  top: ${({ $position }) => ($position === 'left' || $position === 'right') && '50%'};
  left: ${({ $position }) => ($position === 'left' || $position === 'bottom') && theme.spacing.spacing2};
  right: ${({ $position }) => $position === 'right' && theme.spacing.spacing2};
  transform: ${({ $position }) => ($position === 'left' || $position === 'right') && 'translateY(-50%)'};
  bottom: ${({ $position }) => $position === 'bottom' && theme.spacing.spacing1};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export { Adornment, BaseInputWrapper, StyledBaseInput, Wrapper };
