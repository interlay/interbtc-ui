import styled from 'styled-components';

import { theme } from '@/component-library';

const StyledDl = styled.dl`
  display: flex;
  gap: ${theme.spacing.spacing6};
  justify-content: space-between;
  align-items: center;
`;

const StyledDItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.spacing2};
`;

const StyledDt = styled.dt`
  color: ${theme.colors.textTertiary};
`;

const StyledDd = styled.dt`
  color: ${theme.colors.textPrimary};
  font-weight: ${theme.fontWeight.bold};
`;

export { StyledDd, StyledDItem, StyledDl, StyledDt };
