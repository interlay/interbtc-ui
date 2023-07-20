import styled from 'styled-components';

import { Span, theme } from '@/component-library';

const StyledTag = styled(Span)`
  border: ${theme.border.default};
  border-radius: ${theme.rounded.full};
  padding: ${theme.spacing.spacing2};
`;

export { StyledTag };
