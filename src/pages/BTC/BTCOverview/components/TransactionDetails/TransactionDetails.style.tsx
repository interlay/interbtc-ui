import styled from 'styled-components';

import { theme } from '@/component-library/theme';
import { PlusDivider } from '@/components';

const StyledPlusDivider = styled(PlusDivider)`
  margin-bottom: calc(${theme.spacing.spacing2} * -1);
  z-index: 0;
`;

export { StyledPlusDivider };
