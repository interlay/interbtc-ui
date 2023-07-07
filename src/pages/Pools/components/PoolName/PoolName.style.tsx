import styled from 'styled-components';

import { Span } from '@/component-library';

const StyledSpan = styled(Span)`
  display: none;
  white-space: nowrap;

  @media (min-width: 30em) {
    display: block;
  }
`;

export { StyledSpan };
