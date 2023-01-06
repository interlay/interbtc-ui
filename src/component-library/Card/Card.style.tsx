import styled from 'styled-components';

import { Flex } from '../Flex';
import { theme } from '../theme';
import { Variants } from '../utils/prop-types';

type CardVariants = 'default' | 'bordered';

type WrapperProps = { $variant: CardVariants; $color: Variants };

const Wrapper = styled(Flex)<WrapperProps>`
  box-shadow: ${theme.boxShadow.default};
  color: ${theme.colors.textSecondary};
  background-color: ${({ $color }) => ($color === 'primary' ? theme.card.bg : theme.card.secondaryBg)};
  border: ${(props) => props.$variant === 'bordered' && theme.border.default};
  border-radius: ${theme.rounded.xl};
  padding: ${theme.spacing.spacing6};
`;

export { Wrapper };
export type { CardVariants, WrapperProps };
