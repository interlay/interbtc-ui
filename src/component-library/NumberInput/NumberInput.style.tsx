import styled from 'styled-components';

import { Input, InputProps } from '../Input';

const BaseNumberInput = styled(Input).attrs<InputProps>({
  type: 'number',
  step: 'any',
  pattern: '[-+]?[0-9]*[.,]?[0-9]+',
  placeholder: '0.00',
  spellCheck: 'false'
})``;

export { BaseNumberInput };
