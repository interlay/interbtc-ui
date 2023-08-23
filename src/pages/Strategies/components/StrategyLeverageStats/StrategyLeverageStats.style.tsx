import styled from 'styled-components';

import { Dd, Dl, DlGroup, Status, theme } from '@/component-library';

type StyledStatusProps = {
  $status?: Status;
};

const StyledDl = styled(Dl)`
  flex-direction: column;
  padding: 0 ${theme.spacing.spacing8};

  @media ${theme.breakpoints.up('sm')} {
    flex-direction: row;
  }
`;

const StyledDlGroup = styled(DlGroup)`
  text-align: center;
`;

const StyledStatus = styled(Dd)<StyledStatusProps>`
  color: ${({ $status }) => $status && theme.alert.status[$status]};
`;

const StyledDivider = styled.div`
  height: 1px;
  width: auto;
  background-color: ${theme.divider.bg};
  margin: 0 ${theme.spacing.spacing2};

  @media ${theme.breakpoints.up('sm')} {
    height: auto;
    width: 1px;
    margin: ${theme.spacing.spacing2} 0;
  }
`;

export { StyledDivider, StyledDl, StyledDlGroup, StyledStatus };
