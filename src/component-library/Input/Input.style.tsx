import styled from 'styled-components';
import { theme } from 'component-library';

const BaseInput = styled.input`
  /* MEMO: inspired by https://www.w3schools.com/howto/howto_css_hide_arrow_number.asp */
  /* Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button, &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type='number'] {
    -moz-appearance: textfield;
  }

  // TODO: focus styling is missing. see https://www.a11yproject.com/posts/never-remove-css-outlines/#:~:text=Using%20the%20CSS%20rule%20%3Afocus,with%20the%20link%20or%20control.
  :focus {
    outline: none;
  }

  color: ${theme.colors.textPrimary}; // TODO: this might not be needed as it's inherited
  background-color: transparent;
  display: block;
  width: 100%;
  font-size: ${theme.text.base};
  line-height: ${theme.lineHeight.base};
  box-shadow: ${theme.boxShadow.default};
  border-radius: ${theme.rounded.md};
  &::placeholder: {
    color: ${theme.colors.textTertiary};
  }
  border: ${theme.border.default};
  padding: ${theme.spacing.spacing2} ${theme.spacing.spacing3};
`;

export { BaseInput };
