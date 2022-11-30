import styled from 'styled-components';

import { Dd, DlGroup, Dt, theme } from '@/component-library';

const StyledDlGroup = styled(DlGroup)`
  text-align: center;

  &:not(:last-of-type) {
    border-right: ${theme.border.default};
    padding-right: ${theme.spacing.spacing6};
  }
`;

const StyledDt = styled(Dt)`
  font-weight: ${theme.fontWeight.semibold};
`;

const StyledDd = styled(Dd)`
  font-weight: ${theme.fontWeight.bold};
`;

export { StyledDd, StyledDlGroup, StyledDt };
