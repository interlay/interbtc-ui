import styled from 'styled-components';

import { ChevronDown } from '@/assets/icons';
import { Flex } from '@/component-library/Flex';
import { List } from '@/component-library/List';
import { Span } from '@/component-library/Text';
import { theme } from '@/component-library/theme';

type StyledClickableProps = {
  $isClickable: boolean;
};

type StyledListItemSelectedLabelProps = {
  $isSelected: boolean;
};

const StyledAccount = styled.span`
  font-size: ${theme.text.s};
  color: ${theme.colors.textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledAccountSelect = styled(Flex)<StyledClickableProps>`
  background-color: ${theme.tokenInput.endAdornment.bg};
  border-radius: ${theme.rounded.md};
  font-size: ${theme.text.xl2};
  padding: ${theme.spacing.spacing3};
  cursor: ${({ $isClickable }) => $isClickable && 'pointer'};
  height: 3rem;
  width: auto;
  overflow: hidden;
`;

const StyledChevronDown = styled(ChevronDown)`
  margin-left: ${theme.spacing.spacing1};
`;

const StyledAccountLabelAddress = styled(Span)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const StyledAccountLabelName = styled(StyledAccountLabelAddress)<StyledListItemSelectedLabelProps>`
  color: ${({ $isSelected }) =>
    $isSelected ? theme.tokenInput.list.item.selected.text : theme.tokenInput.list.item.default.text};
`;

const StyledList = styled(List)`
  overflow: auto;
  padding: 0 ${theme.dialog.medium.body.paddingX} ${theme.dialog.medium.body.paddingY}
    ${theme.dialog.medium.body.paddingX};
`;

const StyledAccountLabelWrapper = styled(Flex)`
  flex-grow: 1;
  overflow: hidden;
`;

export {
  StyledAccount,
  StyledAccountLabelAddress,
  StyledAccountLabelName,
  StyledAccountLabelWrapper,
  StyledAccountSelect,
  StyledChevronDown,
  StyledList
};
