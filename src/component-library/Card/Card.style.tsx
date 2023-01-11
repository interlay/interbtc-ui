import styled from 'styled-components';

import { Flex } from '../Flex';
import { theme } from '../theme';
import { Rounded, Variants } from '../utils/prop-types';

type CardVariants = 'default' | 'bordered';

type WrapperProps = { $variant: CardVariants; $color: Variants; $rounded: Rounded };

const Wrapper = styled(Flex)<WrapperProps>`
  box-shadow: ${theme.boxShadow.default};
  color: ${theme.colors.textSecondary};
  background-color: ${({ $color }) => ($color === 'primary' ? theme.card.bg : theme.card.secondaryBg)};
  border: ${(props) => props.$variant === 'bordered' && theme.border.default};
  border-radius: ${({ $rounded }) => theme.rounded[$rounded]};
  padding: ${theme.spacing.spacing6};
`;

export { Wrapper };
export type { CardVariants, WrapperProps };
