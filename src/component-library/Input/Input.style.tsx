// ray test touch <<
import styled from 'styled-components';
import { theme } from 'component-library';

const BaseInput = styled.input`
  &::-webkit-outer-spin-button, &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type='number'] {
    -moz-appearance: textfield;
  }
  // TODO: focus styling is missing
  color: ${theme.colors.textPrimary}; // TODO: this might not be needed as it's inherited
  background-color: transparent;
  display: block;
  width: 100%;
  font-size: ${theme.text.base};
  line-height: ${theme.lineHeight.base};
  box-shadow: ${theme.boxShadow.default};
  border-radius: ${theme.rounded.md};
  &::placeholder: ${theme.colors.textTertiary};
  border: ${theme.border.default};
`;

export { BaseInput };
// ray test touch >>
