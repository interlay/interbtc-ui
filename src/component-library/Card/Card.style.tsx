import styled, { css } from 'styled-components';

import { Flex } from '../Flex';
import { theme } from '../theme';
import { CardVariants, Variants } from '../utils/prop-types';

type StyledCardProps = {
  $variant: CardVariants;
  $background: Variants;
  $isHoverable?: boolean;
  $isPressable?: boolean;
};

const StyledCard = styled(Flex)<StyledCardProps>`
  box-shadow: ${theme.boxShadow.default};
  color: ${theme.colors.textPrimary};
  background-color: ${({ $background }) => theme.card.bg[$background]};
  border-width: ${theme.card.borderWidth};
  border-style: solid;
  border-color: ${({ $variant }) =>
    $variant === 'bordered' ? theme.border.color.default : theme.card.outlined.borderColor};
  border-radius: ${theme.rounded.xl};
  padding: ${theme.spacing.spacing6};
  cursor: ${({ $isPressable }) => $isPressable && 'pointer'};
  outline: none;

  ${({ $isHoverable }) =>
    $isHoverable &&
    css`
      &:hover {
        border-color: ${theme.border.color.hover};
      }
    `}

  ${({ $isPressable }) =>
    $isPressable &&
    css`
      &:focus {
        border-color: ${theme.border.color.focus};
        box-shadow: 0 0 0 1px ${theme.boxShadow.color.focus};
      }
    `}
`;

export { StyledCard };
