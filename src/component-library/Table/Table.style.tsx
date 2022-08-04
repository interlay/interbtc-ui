import styled from 'styled-components';

import { theme } from '../theme';

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  isolation: isolate;
`;

const StyledTableColumnHeader = styled.th`
  border-bottom: ${theme.table.border};
  color: ${theme.colors.textTertiary};
  font-weight: ${theme.fontWeight.medium};
  padding: ${theme.spacing.spacing4} 0;
  text-align: left;
  position: relative;

  &:first-of-type {
    padding-left: ${theme.spacing.spacing4};
  }

  &:last-of-type {
    text-align: right;
    padding-right: ${theme.spacing.spacing4};
  }
`;

const StyledTableCell = styled.td`
  color: ${theme.colors.textPrimary};
  padding-top: ${theme.spacing.spacing4};
  padding-bottom: ${theme.spacing.spacing4};
  border-bottom: ${theme.table.border};
  vertical-align: middle;

  &:first-of-type {
    padding-left: ${theme.spacing.spacing4};
  }

  &:last-of-type {
    text-align: right;
    padding-right: ${theme.spacing.spacing4};
  }
`;

// const StyledTableRowGroup = styled.div`
//  vertical-align: middle;
// `

export { StyledTable, StyledTableCell, StyledTableColumnHeader };
