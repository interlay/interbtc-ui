import styled from 'styled-components';

import { Flex } from '@/component-library/Flex';
import { Span } from '@/component-library/Text';
import { theme } from '@/component-library/theme';

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
