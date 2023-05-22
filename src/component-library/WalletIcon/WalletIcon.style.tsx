import styled from 'styled-components';

import { Icon } from '../Icon';
import { theme } from '../theme';

const StyledFallbackIcon = styled(Icon)`
  stroke: ${theme.icon.fallback.stroke};
  color: ${theme.icon.fallback.color};
`;

export { StyledFallbackIcon };
