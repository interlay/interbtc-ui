import styled from 'styled-components';

import { theme } from '../';
import { StackProps } from './';

export const StackContainer = styled.div<StackProps>`
  > *:not(:last-child) {
    margin-bottom: ${(props) => (props.spacing === 'x1' ? theme.spacing.spacing4 : theme.spacing.spacing8)};
  }
`;
