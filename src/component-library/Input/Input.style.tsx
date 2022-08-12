import styled from 'styled-components';

import { theme } from '../theme';

const BaseInput = styled.input`
  background-color: transparent;
  display: block;
  width: 100%;
  line-height: ${theme.lineHeight.base};
  padding: ${theme.spacing.spacing2};
  outline: 0;
  border: 0;
  font: inherit;
  letter-spacing: inherit;
  background: none;
  color: currentcolor;

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

const Wrapper = styled.div`
  box-shadow: ${theme.boxShadow.default};
  border-radius: ${theme.rounded.md};
  border: ${theme.border.default};
  color: ${theme.colors.textPrimary};
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding-right: ${theme.spacing.spacing2};

  // TODO: remove when implemented with react-aria
  &:focus-within {
    outline: ${theme.outline.default};
  }
`;

const Adornment = styled.div`
  display: flex;
  height: 0.01em;
  max-height: 2em;
  align-items: center;
  white-space: nowrap;
  margin-left: 8px;
`;

export { Adornment, BaseInput, Wrapper };
