import styled from 'styled-components';

import { Card, Flex, Span, Switch, theme } from '@/component-library';

type StyledListItemSelectedLabelProps = {
  $isSelected: boolean;
};

const StyledCard = styled(Card)`
  box-shadow: none;
`;

const StyledChain = styled.span`
  font-size: ${theme.text.s};
  color: ${theme.colors.textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledListItemLabel = styled(Span)<StyledListItemSelectedLabelProps>`
  color: ${({ $isSelected }) =>
    $isSelected ? theme.tokenInput.list.item.selected.text : theme.tokenInput.list.item.default.text};
  text-overflow: ellipsis;
  overflow: hidden;
`;

const StyledVaultName = styled(Span)<StyledListItemSelectedLabelProps>`
  color: ${({ $isSelected }) =>
    $isSelected ? theme.tokenInput.list.item.selected.text : theme.tokenInput.list.item.default.text};
`;

const StyledListWrapper = styled(Flex)`
  overflow: hidden;
`;

const StyledListLabelWrapper = styled(Flex)`
  overflow: hidden;
`;

const StyledVaultAddress = styled(Span)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const StyledVaultIcon = styled(Flex)`
  & :last-child {
    margin-left: -25%;
    z-index: 1;
  }
`;

const StyledSwitch = styled(Switch)`
  flex-direction: row-reverse;
  justify-content: space-between;
`;

export {
  StyledCard,
  StyledChain,
  StyledListItemLabel,
  StyledListLabelWrapper,
  StyledListWrapper,
  StyledSwitch,
  StyledVaultAddress,
  StyledVaultIcon,
  StyledVaultName
};
