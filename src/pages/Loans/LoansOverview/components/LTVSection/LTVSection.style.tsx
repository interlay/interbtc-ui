import styled from 'styled-components';

import { Dd, Dl, DlGroup, Dt, Status, theme } from '@/component-library';

import { LTVMeter } from '../LTVMeter.tsx';

type StyledStatusProps = {
  $status?: Status;
};

const StyledDl = styled(Dl)`
  flex-direction: column;
  padding: 0 ${theme.spacing.spacing8};

  @media (min-width: 64em) {
    flex-direction: row;
  }
`;

const StyledDlGroup = styled(DlGroup)`
  text-align: center;
`;

const StyledDt = styled(Dt)`
  font-weight: ${theme.fontWeight.semibold};
`;

const StyledDd = styled(Dd)`
  font-weight: ${theme.fontWeight.bold};
`;

const StyledStatus = styled(StyledDd)<StyledStatusProps>`
  color: ${({ $status }) => $status && theme.alert.status[$status]};
`;

const StyledLTVMeter = styled(LTVMeter)`
  padding: ${theme.spacing.spacing2};
`;

const StyledDivider = styled.div`
  height: 1px;
  width: auto;
  background-color: ${theme.divider.bg};
  margin: 0 ${theme.spacing.spacing2};

  @media (min-width: 64em) {
    height: auto;
    width: 1px;
    margin: ${theme.spacing.spacing2} 0;
  }
`;

export { StyledDd, StyledDivider, StyledDl, StyledDlGroup, StyledDt, StyledLTVMeter, StyledStatus };
