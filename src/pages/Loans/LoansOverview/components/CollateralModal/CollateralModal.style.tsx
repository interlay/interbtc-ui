import styled from 'styled-components';

import { H3, P, theme } from '@/component-library';

const StyledTitle = styled(H3)`
  font-size: ${theme.text.xl};
`;

const StyledDescription = styled(P)`
  font-size: ${theme.text.s};
  text-align: center;
`;

export { StyledDescription, StyledTitle };
