import styled from 'styled-components';

import { Card, Dl, theme } from '@/component-library';

const StyledWrapper = styled(Card)`
  flex-direction: column;
  justify-content: space-between;
  gap: ${theme.spacing.spacing4};

  @media (min-width: 64em) {
    flex-direction: row;
    align-items: center;
    gap: ${theme.spacing.spacing10};
  }
`;

const StyledDl = styled(Dl)`
  @media (min-width: 64em) {
    padding-right: ${theme.spacing.spacing10};
    border-right: 1px solid ${theme.colors.textTertiary};
  }
`;

export { StyledDl, StyledWrapper };
