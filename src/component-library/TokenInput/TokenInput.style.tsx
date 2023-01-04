import styled from 'styled-components';

import { ChevronDown } from '@/assets/icons';

import { CoinIcon } from '../CoinIcon';
import { Flex } from '../Flex';
import { List } from '../List';
import { Span } from '../Text';
import { theme } from '../theme';

type StyledClickableProps = {
  $isClickable: boolean;
  $hasToken: boolean;
};

type StyledTokenInputBalanceValueProps = {
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

const StyledTokenSelect = styled(Flex)<StyledClickableProps>`
  background-color: ${theme.tokenInput.endAdornment.bg};
  border-radius: ${theme.rounded.md};
  font-size: ${theme.text.xl2};
  padding: ${theme.spacing.spacing3};
  cursor: ${({ $isClickable }) => $isClickable && 'pointer'};
  height: 3rem;
  width: ${({ $hasToken, $isClickable }) => {
    if (!$hasToken) return '8.5rem';

    return $isClickable ? '7rem' : '5.25rem';
  }};
`;

const StyledChevronDown = styled(ChevronDown)`
  margin-left: ${theme.spacing.spacing1};
  flex: 1 0 auto;
`;

const StyledCoinIcon = styled(CoinIcon)`
  flex: 1 0 auto;
`;

const StyledTokenInputBalanceWrapper = styled.dl`
  display: inline-flex;
  gap: ${theme.spacing.spacing1};
  font-weight: ${theme.fontWeight.medium};
  line-height: ${theme.lineHeight.lg};
  font-size: ${theme.text.xs};
  padding: ${theme.spacing.spacing1} 0;
`;

const StyledTokenInputBalanceLabel = styled.dt`
  color: ${theme.colors.textTertiary};

  &:after {
    content: ':';
  }
`;

const StyledTokenInputBalanceValue = styled.span<StyledTokenInputBalanceValueProps>`
  display: block;
  color: ${theme.colors.textSecondary};
  cursor: ${(props) => props.$isClickable && 'pointer'};
`;

const StyledListItemLabel = styled(Span)<StyledListItemSelectedLabelProps>`
  color: ${({ $isSelected }) =>
    $isSelected ? theme.tokenInput.list.item.selected.text : theme.tokenInput.list.item.default.text};
`;

const StyledList = styled(List)`
  overflow: auto;
  padding: 0 ${theme.modal.body.paddingX} ${theme.modal.body.paddingY} ${theme.modal.body.paddingX};
`;

const StyledListHeader = styled(Flex)`
  padding: ${theme.modal.body.paddingY} ${theme.modal.body.paddingX};
`;

export {
  StyledChevronDown,
  StyledCoinIcon,
  StyledList,
  StyledListHeader,
  StyledListItemLabel,
  StyledTicker,
  StyledTokenInputBalanceLabel,
  StyledTokenInputBalanceValue,
  StyledTokenInputBalanceWrapper,
  StyledTokenSelect,
  StyledUSDAdornment
};
