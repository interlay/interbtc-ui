import styled from 'styled-components';

import { Dd, Dt, theme } from '@/component-library';

const StyledDt = styled(Dt)`
  font-weight: ${theme.fontWeight.semibold};
  white-space: nowrap;
`;

const StyledDd = styled(Dd)`
  font-weight: ${theme.fontWeight.bold};
`;

export { StyledDd, StyledDt };
