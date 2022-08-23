import styled from 'styled-components';

import { NumberInput } from '../NumberInput';
import { theme } from '../theme';

const TokenFieldInnerWrapper = styled.div`
  position: relative;
`;

const TokenFieldSymbol = styled.span`
  font-size: ${theme.text.xl2};
  color: ${theme.colors.textTertiary};
  font-weight: ${theme.fontWeight.medium};
`;

const TokenFieldInput = styled(NumberInput)`
  font-size: ${theme.text.xl5};
`;

const TokenFieldUSD = styled.span`
  display: block;
  font-size: ${theme.text.lg};
  color: ${theme.colors.textTertiary};
  white-space: nowrap;
`;

const TokenAdornment = styled.span`
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export { TokenAdornment, TokenFieldInnerWrapper, TokenFieldInput, TokenFieldSymbol, TokenFieldUSD };
