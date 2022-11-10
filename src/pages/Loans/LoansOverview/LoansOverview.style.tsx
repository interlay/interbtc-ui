import styled from 'styled-components';

import { H1, theme } from '@/component-library';

const StyledTitle = styled(H1)`
  text-align: center;
  font-size: ${theme.text.xl4};
  font-weight: ${theme.fontWeight.bold};
`;

export { StyledTitle };
