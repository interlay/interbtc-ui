import styled from 'styled-components';

import { ReactComponent as ChevronDown } from '@/assets/img/icons/chevron-down.svg';

import { CoinIcon } from '../CoinIcon';
import { Flex } from '../Flex';
import { Span } from '../Text';
import { theme } from '../theme';

type StyledClickableProps = {
  $isClickable: boolean;
};

type StyledListItemSelectedLabelProps = {
  $isSelected: boolean;
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

const StyledCurrencyAdornment = styled(Flex)<StyledClickableProps>`
  background-color: ${theme.tokenInput.endAdornment.bg};
  border-radius: ${theme.rounded.md};
  font-size: ${theme.text.xl2};
  padding: ${theme.spacing.spacing3};
  cursor: ${({ $isClickable }) => $isClickable && 'pointer'};
  width: ${({ $isClickable }) => ($isClickable ? '7rem' : '5.25rem')};
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

const StyledCurrencyBalanceWrapper = styled.dl`
  display: inline-flex;
  gap: ${theme.spacing.spacing1};
  font-weight: ${theme.fontWeight.medium};
  line-height: ${theme.lineHeight.lg};
  font-size: ${theme.text.xs};
  padding: ${theme.spacing.spacing1} 0;
`;

const StyledCurrencyBalanceLabel = styled.dt`
  color: ${theme.colors.textTertiary};

  &:after {
    content: ':';
  }
`;

const StyledCurrencyBalanceValue = styled.span<StyledClickableProps>`
  display: block;
  color: ${theme.colors.textSecondary};
  cursor: ${(props) => props.$isClickable && 'pointer'};
`;

const StyledListItemLabel = styled(Span)<StyledListItemSelectedLabelProps>`
  color: ${({ $isSelected }) =>
    $isSelected ? theme.tokenInput.list.item.selected.text : theme.tokenInput.list.item.default.text};
`;

export {
  StyledChevronDown,
  StyledCoinIcon,
  StyledCurrencyAdornment,
  StyledCurrencyBalanceLabel,
  StyledCurrencyBalanceValue,
  StyledCurrencyBalanceWrapper,
  StyledListItemLabel,
  StyledTicker,
  StyledUSDAdornment
};
