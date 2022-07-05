import styled from 'styled-components';

import { theme } from 'componentLibrary';

const BaseInput = styled.input`
  color: ${theme.colors.textPrimary};
  background-color: transparent;
  display: block;
  width: 100%;
  font-size: ${theme.text.base};
  line-height: ${theme.lineHeight.base};
  box-shadow: ${theme.boxShadow.default};
  border-radius: ${theme.rounded.md};
  border: ${theme.border.default};
  padding: ${theme.spacing.spacing2};

  &::placeholder: {
    color: ${theme.colors.textTertiary};
  }
  // ray test touch <
  &:focus {
    outline: ${theme.outline.default};
  }
  // ray test touch >
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

export { BaseInput };
