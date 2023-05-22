import styled from 'styled-components';

import { Flex } from '@/component-library/Flex';
import { Span } from '@/component-library/Text';
import { theme } from '@/component-library/theme';

type StyledListItemSelectedLabelProps = {
  $isSelected: boolean;
};

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

const StyledListChainWrapper = styled(Flex)`
  overflow: hidden;
`;

export { StyledChain, StyledListChainWrapper, StyledListItemLabel };
