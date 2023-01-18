import styled from 'styled-components';

import { ChevronDown } from '@/assets/icons';

import { Flex } from '../Flex';
import { List } from '../List';
import { Span } from '../Text';
import { theme } from '../theme';

type StyledClickableProps = {
  $isClickable: boolean;
};

type StyledTokenInputBalanceValueProps = {
  $isDisabled?: boolean;
  $isFocusVisible: boolean;
};

type StyledListItemSelectedLabelProps = {
  $isSelected: boolean;
};

const StyledTicker = styled.span`
  font-size: ${theme.text.s};
  color: ${theme.colors.textPrimary};
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
  width: auto;
`;

const StyledChevronDown = styled(ChevronDown)`
  margin-left: ${theme.spacing.spacing1};
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
  cursor: ${({ $isDisabled }) => !$isDisabled && 'pointer'};
  outline: ${({ $isFocusVisible }) => !$isFocusVisible && 'none'};
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
