import styled from 'styled-components';

import { theme } from '../theme';

type CardVariants = 'default' | 'bordered';

type WrapperProps = { variant: CardVariants };

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex-direction: column;
  box-shadow: ${theme.boxShadow.default};
  color: ${theme.colors.textSecondary};
  background-color: ${theme.card.bg};
  border: ${(props) => props.variant === 'bordered' && theme.border.default};
  border-radius: ${theme.rounded.xl};
  padding: ${theme.spacing.spacing6};
`;

export { Wrapper };
export type { CardVariants, WrapperProps };
