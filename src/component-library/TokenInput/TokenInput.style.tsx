import styled from 'styled-components';

import { ReactComponent as ChevronDown } from '@/assets/img/icons/chevron-down.svg';

import { CoinIcon } from '../CoinIcon';
import { Flex } from '../Flex';
import { theme } from '../theme';

type StyledTokenAdornmentProps = {
  $isClickable: boolean;
};

const StyledTicker = styled.span`
  font-size: ${theme.text.s};
  color: ${theme.colors.textPrimary};
  flex: 0 1 auto;
`;

const StyledUSDAdornment = styled.span`
  display: block;
  font-size: ${theme.text.xs};
  line-height: ${theme.lineHeight.s};
  color: ${theme.colors.textTertiary};
  white-space: nowrap;
  align-self: flex-start;
`;

const StyledTokenAdornment = styled(Flex)<StyledTokenAdornmentProps>`
  background-color: ${theme.tokenInput.endAdornment.bg};
  border-radius: ${theme.rounded.md};
  font-size: ${theme.text.xl2};
  padding: ${theme.spacing.spacing3};
  cursor: ${({ $isClickable }) => $isClickable && 'pointer'};
  max-width: ${({ $isClickable }) => ($isClickable ? '7rem' : '5.25rem')};
`;

const StyledChevronDown = styled(ChevronDown)`
  margin-left: ${theme.spacing.spacing1};
  font-size: ${theme.text.lg};
  flex: 1 0 auto;
  width: 1em;
  height: 1em;
`;

const StyledCoinIcon = styled(CoinIcon)`
  flex: 1 0 auto;
`;

const TokenBalanceWrapper = styled.dl`
  display: inline-flex;
  gap: ${theme.spacing.spacing1};
  font-weight: ${theme.fontWeight.medium};
  line-height: ${theme.lineHeight.lg};
  font-size: ${theme.text.xs};
  padding: ${theme.spacing.spacing1} 0;
`;

const TokenBalanceLabel = styled.dt`
  color: ${theme.colors.textTertiary};

  &:after {
    content: ':';
  }
`;

type TokenBalanceValueProps = {
  $clickable?: boolean;
};

const TokenBalanceValue = styled.span<TokenBalanceValueProps>`
  display: block;
  color: ${theme.colors.textSecondary};
  cursor: ${(props) => props.$clickable && 'pointer'};
`;

export {
  StyledChevronDown,
  StyledCoinIcon,
  StyledTicker,
  StyledTokenAdornment,
  StyledUSDAdornment,
  TokenBalanceLabel,
  TokenBalanceValue,
  TokenBalanceWrapper
};
