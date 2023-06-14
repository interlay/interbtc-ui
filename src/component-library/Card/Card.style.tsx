import styled, { css } from 'styled-components';

import { Flex } from '../Flex';
import { theme } from '../theme';
import { BorderRadius, CardVariants, Spacing, Variants } from '../utils/prop-types';

type StyledCardProps = {
  $variant: CardVariants;
  $rounded: BorderRadius;
  $padding: Spacing;
  $background: Variants;
  $isHoverable?: boolean;
  $isPressable?: boolean;
};

const StyledCard = styled(Flex)<StyledCardProps>`
  box-shadow: ${theme.boxShadow.default};
  color: ${theme.colors.textPrimary};
  background-color: ${({ $background }) => theme.card.bg[$background]};
  border: ${({ $variant }) => ($variant === 'bordered' ? theme.border.default : theme.card.outlined.border)};
  border-radius: ${({ $rounded }) => theme.rounded[$rounded]};
  padding: ${({ $padding }) => theme.spacing[$padding]};
  cursor: ${({ $isPressable }) => $isPressable && 'pointer'};
  outline: none;

  ${({ $isHoverable }) =>
    $isHoverable &&
    css`
      &:hover {
        border: ${theme.border.hover};
      }
    `}

  ${({ $isPressable }) =>
    $isPressable &&
    css`
      &:focus {
        border: ${theme.border.focus};
        box-shadow: ${theme.boxShadow.focus};
      }
    `}
`;

export { StyledCard };
