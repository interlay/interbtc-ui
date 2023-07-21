import styled from 'styled-components';

import { Flex, Span, theme } from '@/component-library';

type StyledListItemSelectedLabelProps = {
  $isSelected: boolean;
};

const StyledAccountLabelAddress = styled(Span)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const StyledAccountLabelName = styled(StyledAccountLabelAddress)<StyledListItemSelectedLabelProps>`
  color: ${({ $isSelected }) =>
    $isSelected ? theme.tokenInput.list.item.selected.text : theme.tokenInput.list.item.default.text};
`;

const StyledAccountLabelWrapper = styled(Flex)`
  flex-grow: 1;
  overflow: hidden;
`;

export { StyledAccountLabelAddress, StyledAccountLabelName, StyledAccountLabelWrapper };
