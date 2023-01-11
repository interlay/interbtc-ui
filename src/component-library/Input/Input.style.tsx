import styled from 'styled-components';

import { theme } from '../theme';
import { Placement, Sizes } from '../utils/prop-types';

type PaddingX = { left?: keyof typeof theme.input.paddingX; right?: keyof typeof theme.input.paddingX };

type BaseInputProps = {
  $size: Sizes;
  $paddingX?: PaddingX;
  $adornments: { bottom: boolean; left: boolean; right: boolean };
  $isDisabled: boolean;
  $hasError: boolean;
};

type AdornmentProps = {
  $position: Placement;
};

const StyledBaseInput = styled.input<BaseInputProps>`
  display: block;
  width: 100%;
  height: 100%;

  outline: none;
  font: inherit;
  letter-spacing: inherit;
  background: none;

  color: ${(props) => (props.disabled ? theme.input.disabled.color : theme.input.color)};
  font-size: ${({ $size, $adornments }) =>
    $adornments.bottom ? theme.input.overflow.large.text : theme.input[$size].text};
  line-height: ${theme.lineHeight.base};

  background-color: ${theme.input.background};
  overflow: hidden;

  border: ${(props) =>
    props.$isDisabled
      ? theme.input.disabled.border
      : props.$hasError
      ? theme.input.error.border
      : theme.border.default};
  border-radius: ${theme.rounded.md};
  transition: border-color ${theme.transition.duration.duration150}ms ease-in-out,
    box-shadow ${theme.transition.duration.duration150}ms ease-in-out;

  padding-top: ${theme.spacing.spacing2};
  padding-left: ${({ $adornments, $paddingX }) => {
    if (!$adornments.left) return theme.spacing.spacing2;

    return $paddingX?.left ? theme.input.paddingX[$paddingX.left] : theme.input.paddingX.md;
  }};
  padding-right: ${({ $adornments, $paddingX }) => {
    if (!$adornments.right) return theme.spacing.spacing2;

    return $paddingX?.right ? theme.input.paddingX[$paddingX.right] : theme.input.paddingX.md;
  }};
  padding-bottom: ${({ $adornments }) => ($adornments.bottom ? theme.spacing.spacing6 : theme.spacing.spacing2)};

  &:hover:not(:disabled):not(:focus) {
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

// TODO: simplify this (put into theme)
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

const Wrapper = styled.div<Pick<BaseInputProps, '$isDisabled'>>`
  display: flex;
  flex-direction: column;
  opacity: ${({ $isDisabled }) => $isDisabled && 0.5};
`;

export { Adornment, BaseInputWrapper, StyledBaseInput, Wrapper };
export type { PaddingX };
