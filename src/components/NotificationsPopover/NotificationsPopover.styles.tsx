import styled from 'styled-components';

import { CTA, theme } from '@/component-library';

const StyledListItem = styled.div`
  padding: ${theme.spacing.spacing3} ${theme.spacing.spacing2};

  &:not(:last-of-type) {
    border-bottom: ${theme.border.default};
  }
`;

const StyledCTA = styled(CTA)`
  padding: ${theme.spacing.spacing3};
  border: ${theme.border.default};
`;

export { StyledCTA, StyledListItem };
