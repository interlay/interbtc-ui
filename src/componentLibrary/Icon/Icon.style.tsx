import styled from 'styled-components';

interface IconWrapperProps {
  color?: string
}

export const IconWrapper = styled.div<IconWrapperProps>`
  fill: ${(props) => props.color};
`;

export type { IconWrapperProps };