import styled from 'styled-components';
import { theme } from 'componentLibrary';

interface IconWrapperProps {
  color?: string
}

export const IconWrapper = styled.div<IconWrapperProps>`
  fill: ${theme.colors.iconDefault};
`;

export type { IconWrapperProps };