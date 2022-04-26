import styled from 'styled-components';

interface IconWrapperProps {
  size: 'small' | 'large';
}

export const IconWrapper = styled.div<IconWrapperProps>`
  width: ${props => props.size === 'small' ? '2.625rem' : '3.755rem'};
`;

export type { IconWrapperProps };
