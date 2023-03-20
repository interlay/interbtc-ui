import styled, { css } from 'styled-components';

import { Flex } from '../Flex';
import { theme } from '../theme';
import { Variants } from '../utils/prop-types';

type StyledListProps = {
  $variant: Variants | 'card';
};

const StyledList = styled(Flex)<StyledListProps>`
  background-color: ${({ $variant }) => theme.list[$variant].bg};
  border-radius: ${({ $variant }) => theme.list[$variant].rounded};
  border: ${({ $variant }) => theme.list[$variant].border};
  overflow: hidden;
`;

type StyledListItemProps = {
  $variant: Variants | 'card';
  $isDisabled: boolean;
  $isHovered: boolean;
  $isInteractable: boolean;
  $isFocusVisible: boolean;
};

const StyledListItem = styled.li<StyledListItemProps>`
  flex: 1;
  align-self: stretch;
  padding: ${theme.spacing.spacing3};
  border-radius: ${({ $variant }) => theme.list.item[$variant].rounded};
  background-color: ${({ $variant, $isHovered, $isFocusVisible }) =>
    $isHovered || $isFocusVisible ? theme.list.item[$variant].hover.bg : theme.list.item[$variant].bg};
  border: ${({ $variant }) => {
    if ($variant === 'card') {
      return '';
    }

    return theme.list.item[$variant].border;
  }};
  color: ${theme.colors.textPrimary};
  cursor: ${({ $isInteractable }) => $isInteractable && 'pointer'};
  outline: ${({ $isFocusVisible }) => !$isFocusVisible && 'none'};

  ${({ $variant }) => {
    if ($variant === 'card') {
      return css`
        &:not(:first-of-type) {
          border-top: ${theme.list.item.card.border};
        }
      `;
    }

    return css`
      &[aria-selected='true'] {
        background-color: ${theme.colors.textSecondary};
        color: ${theme.list.text};
        border-color: ${theme.colors.textSecondary};
      }
    `;
  }}
`;

export { StyledList, StyledListItem };
