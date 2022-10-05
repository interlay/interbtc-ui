import styled from 'styled-components';

import { NumberInput } from '../NumberInput';
import { theme } from '../theme';
import { TokenBalance } from '../TokenBalance';

const TokenInputInnerWrapper = styled.div`
  position: relative;
`;

const TokenInputSymbol = styled.span`
  font-size: ${theme.text.xl2};
  color: ${theme.colors.textTertiary};
  font-weight: ${theme.fontWeight.medium};
`;

type TokenInputInputProps = {
  $isOverflowing?: boolean;
};

const TokenInputInput = styled(NumberInput)<TokenInputInputProps>`
  height: ${theme.tokenInput.height};
  max-height: ${theme.tokenInput.height};
  font-size: ${({ $isOverflowing }) => ($isOverflowing ? theme.text.xl2 : theme.text.xl5)};
`;

const TokenInputUSD = styled.span`
  display: block;
  font-size: ${theme.text.s};
  color: ${theme.colors.textPrimary};
  white-space: nowrap;
`;

const TokenAdornment = styled.span`
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
`;

const StyledTokenBalance = styled(TokenBalance)`
  font-size: ${theme.text.s};
  line-height: ${theme.lineHeight.s};
`;

export { StyledTokenBalance, TokenAdornment, TokenInputInnerWrapper, TokenInputInput, TokenInputSymbol, TokenInputUSD };
