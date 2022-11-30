import styled from 'styled-components';

import { Dd, Dl, DlGroup, Dt, theme } from '@/component-library';

import { LTVMeter } from '../LTVMeter.tsx';

const StyledDl = styled(Dl)`
  flex-direction: column;
  padding: 0 ${theme.spacing.spacing8};

  @media (min-width: 64em) {
    flex-direction: row;
  }
`;

const StyledDlGroup = styled(DlGroup)`
  text-align: center;

  &:not(:last-of-type) {
    border-bottom: ${theme.border.default};
    padding-bottom: ${theme.spacing.spacing6};

    @media (min-width: 64em) {
      border-bottom: 0;
      padding-bottom: 0;
      border-right: ${theme.border.default};
      padding-right: ${theme.spacing.spacing6};
    }
  }
`;

const StyledDt = styled(Dt)`
  font-weight: ${theme.fontWeight.semibold};
`;

const StyledDd = styled(Dd)`
  font-weight: ${theme.fontWeight.bold};
`;

const StyledLTVMeter = styled(LTVMeter)`
  padding: ${theme.spacing.spacing2};
`;

export { StyledDd, StyledDl, StyledDlGroup, StyledDt, StyledLTVMeter };
