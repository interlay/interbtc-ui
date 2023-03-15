import styled from 'styled-components';

import { Icon } from '@/component-library/Icon';
import { theme } from '@/component-library/theme';

const StyledFallbackIcon = styled(Icon)`
  stroke: ${theme.icon.fallback.stroke};
  color: ${theme.icon.fallback.color};
`;

export { StyledFallbackIcon };
