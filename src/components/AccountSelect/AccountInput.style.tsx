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

const StyledListItemLabel = styled(Span)<StyledListItemSelectedLabelProps>`
  color: ${({ $isSelected }) =>
    $isSelected ? theme.tokenInput.list.item.selected.text : theme.tokenInput.list.item.default.text};
  text-overflow: ellipsis;
  overflow: hidden;
`;

const StyledList = styled(List)`
  overflow: auto;
  padding: 0 ${theme.modal.body.paddingX} ${theme.modal.body.paddingY} ${theme.modal.body.paddingX};
`;

const StyledListAccountWrapper = styled(Flex)`
  overflow: hidden;
`;

export {
  StyledAccount,
  StyledAccountSelect,
  StyledChevronDown,
  StyledList,
  StyledListAccountWrapper,
  StyledListItemLabel
};
