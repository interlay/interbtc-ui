import styled from 'styled-components';

import { theme } from '../theme';

const BaseInput = styled.input`
  background-color: transparent;
  display: block;
  width: 100%;
  line-height: ${theme.lineHeight.base};
  padding: ${theme.spacing.spacing2};
  outline: none;
  border: 0;
  font: inherit;
  letter-spacing: inherit;
  background: none;
  color: currentcolor;

  &:focus {
    box-shadow: none;
  }

  &::placeholder: {
    color: ${theme.colors.textTertiary};
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

type WrapperProps = {
  $hasStartAdornment: boolean;
  $hasEndAdornment: boolean;
};

const Wrapper = styled.div<WrapperProps>`
  box-shadow: ${theme.boxShadow.default};
  border-radius: ${theme.rounded.md};
  border: ${theme.border.default};
  color: ${theme.colors.textPrimary};
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding-left: ${(props) => props.$hasStartAdornment && theme.spacing.spacing2};
  padding-right: ${(props) => props.$hasEndAdornment && theme.spacing.spacing2};

  // TODO: remove when implemented with react-aria
  &:focus-within {
    outline: ${theme.outline.default};
  }
`;

const Adornment = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  position: relative;
`;

export { Adornment, BaseInput, Wrapper };
