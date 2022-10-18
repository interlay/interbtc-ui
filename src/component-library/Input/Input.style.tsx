import styled from 'styled-components';

import { theme } from '../theme';
import { Sizes } from '../utils/prop-types';

/* height: ${theme.tokenInput.height};
  max-height: ${theme.tokenInput.height};
  font-size: ${({ $isOverflowing }) => ($isOverflowing ? theme.text.xl2 : theme.text.xl5)}; */

type BaseInputProps = {
  $size: Sizes;
  $isOverflow: boolean;
};

const StyledBaseInput = styled.input<BaseInputProps>`
  background-color: transparent;
  display: block;
  width: 100%;
  height: 100%;
  line-height: ${theme.lineHeight.base};
  padding: ${theme.spacing.spacing2};
  outline: none;
  border: 0;
  font: inherit;
  letter-spacing: inherit;
  background: none;
  color: ${(props) => (props.disabled ? theme.input.disabled.color : theme.input.color)};
  font-size: ${(props) =>
    props.$isOverflow ? theme.input.size.overflow[props.$size].text : theme.input.size.normal[props.$size].text};

  &:focus {
    box-shadow: none;
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

type BaseInputWrapperProps = {
  $hasStartAdornment?: boolean;
  $hasEndAdornment?: boolean;
  $hasError?: boolean;
  $isDisabled?: boolean;
  $fontResize: boolean;
  $size: Sizes;
};

const BaseInputWrapper = styled.div<BaseInputWrapperProps>`
  height: ${(props) => (props.$fontResize ? theme.input.size.overflow[props.$size].height : '100%')};
  background-color: ${theme.input.background};
  border-radius: ${theme.rounded.md};
  color: ${theme.colors.textPrimary};
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding-left: ${(props) => props.$hasStartAdornment && theme.spacing.spacing2};
  padding-right: ${(props) => props.$hasEndAdornment && theme.spacing.spacing2};
  border: ${(props) =>
    props.$isDisabled
      ? theme.input.disabled.border
      : props.$hasError
      ? theme.input.error.border
      : theme.border.default};

  &:hover {
    border: ${(props) => !props.$isDisabled && !props.$hasError && theme.input.hover.border};
  }

  &:focus-within {
    border: ${(props) => !props.$isDisabled && theme.input.focus.border};
    box-shadow: ${(props) => !props.$isDisabled && theme.input.focus.boxShadow};
  }
`;

const Adornment = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  position: relative;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export { Adornment, BaseInputWrapper, StyledBaseInput, Wrapper };
