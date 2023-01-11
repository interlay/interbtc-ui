import styled from 'styled-components';

import { theme } from '../theme';
import { Variants } from '../utils/prop-types';

type StyledListItemProps = {
  $variant: Variants;
  $isDisabled: boolean;
  $isHovered: boolean;
  $isInteractable: boolean;
  $isFocusVisible: boolean;
};

const StyledListItem = styled.li<StyledListItemProps>`
  flex: 1;
  align-self: stretch;
  padding: ${theme.spacing.spacing3};
  border-radius: ${theme.rounded.md};
  background-color: ${({ $variant, $isHovered, $isFocusVisible }) =>
    $isHovered || $isFocusVisible ? theme.list[$variant].hover.bg : theme.list[$variant].bg};
  border: ${({ $variant }) => theme.list[$variant].border};
  color: ${theme.colors.textPrimary};
  cursor: ${({ $isInteractable }) => $isInteractable && 'pointer'};
  outline: ${({ $isFocusVisible }) => !$isFocusVisible && 'none'};

  &[aria-selected='true'] {
    background-color: ${theme.colors.textSecondary};
    color: ${theme.list.text};
    border-color: ${theme.colors.textSecondary};
  }
`;

export { StyledListItem };
