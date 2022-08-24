import styled from 'styled-components';

import { theme } from '../theme';

const Mask = styled.circle.attrs({ stroke: 'currentColor' })`
  color: ${theme.progress.circle.mask};
`;

const Fill = styled.circle.attrs({ stroke: 'currentColor' })`
  color: ${theme.progress.circle.fill};
`;

export { Fill, Mask };
