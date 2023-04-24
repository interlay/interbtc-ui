import styled from 'styled-components';

import { Flex, theme } from '@/component-library';

import { AuthListItem } from './AuthListItem';

const StyledItem = styled(Flex)`
  border: ${theme.border.default};
  border-radius: ${theme.rounded.md};
  background-color: ${theme.list.item.primary.bg};
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background-color: ${theme.list.item.primary.hover.bg};
  }
`;

const StyledAccountItem = styled(AuthListItem)`
  padding: ${theme.spacing.spacing2} ${theme.spacing.spacing3};
`;

const StyledCopyItem = styled(AuthListItem)`
  padding: ${theme.spacing.spacing5};
`;

const StyledWalletItem = styled(AuthListItem)`
  padding: ${theme.spacing.spacing5} ${theme.spacing.spacing3};
`;

export { StyledAccountItem, StyledCopyItem, StyledItem, StyledWalletItem };
