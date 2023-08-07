import styled from 'styled-components';

import { Flex, Span, theme } from '@/component-library';

type StyledListItemSelectedLabelProps = {
  $isSelected: boolean;
};

const StyledAccountItemAddress = styled(Span)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const StyledAccountItemName = styled(StyledAccountItemAddress)<StyledListItemSelectedLabelProps>`
  color: ${({ $isSelected }) =>
    $isSelected ? theme.tokenInput.list.item.selected.text : theme.tokenInput.list.item.default.text};
`;

const StyledAccountItemWrapper = styled(Flex)`
  flex-grow: 1;
  overflow: hidden;
`;

export { StyledAccountItemAddress, StyledAccountItemName, StyledAccountItemWrapper };
