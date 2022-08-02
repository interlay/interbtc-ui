import styled from 'styled-components';

import { theme } from '../theme';

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  isolation: isolate;
`;

const StyledTableColumnHeader = styled.th`
  border-bottom: ${theme.table.border2};
  color: ${theme.colors.textPrimary};
  font-weight: ${theme.fontWeight.bold};
  font-size: ${theme.text.xs};
  line-height: ${theme.lineHeight.lg};
  padding: ${theme.spacing.spacing2} 0;
  text-align: left;
  position: relative;

  &:last-of-type {
    text-align: right;
    padding-right: ${theme.spacing.spacing5};
  }
`;

const StyledTableCell = styled.td`
  font-weight: ${theme.fontWeight.medium};
  font-size: ${theme.text.s};
  line-height: ${theme.lineHeight.lg};
  color: ${theme.colors.textPrimary};
  padding-top: ${theme.spacing.spacing3};
  padding-bottom: ${theme.spacing.spacing3};
  border-bottom: ${theme.table.border2};

  &:last-of-type {
    text-align: right;
    padding-right: ${theme.spacing.spacing5};
  }
`;

export { StyledTable, StyledTableCell, StyledTableColumnHeader };
