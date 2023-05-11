import styled from 'styled-components';

import { ArrowRight } from '@/assets/icons';
import { Flex, P, theme } from '@/component-library';

import { AuthListItem } from './AuthListItem';

type StyledArrowRightProps = {
  $isSelected: boolean;
};

const StyledItem = styled(Flex)`
  border: ${theme.border.default};
  border-radius: ${theme.rounded.md};
  background-color: ${theme.list.item.primary.bg};
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background-color: ${theme.list.item.primary.hover.bg};
  }

  &[aria-selected='true'] {
    background-color: ${theme.colors.textSecondary};
    color: ${theme.list.text};
    border-color: ${theme.colors.textSecondary};
  }
`;

const StyledArrowRight = styled(ArrowRight)<StyledArrowRightProps>`
  color: ${({ $isSelected }) => $isSelected && theme.list.text};
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

const StyledP = styled(P)<StyledArrowRightProps>`
  color: ${({ $isSelected }) => $isSelected && theme.list.text};
`;

export { StyledAccountItem, StyledArrowRight, StyledCopyItem, StyledItem, StyledP, StyledWalletItem };
