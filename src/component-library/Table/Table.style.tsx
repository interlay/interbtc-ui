import styled from 'styled-components';

import { theme } from '../theme';

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  isolation: isolate;
  border: ${theme.table.border};
  border-radius: 4px;
  overflow: hidden;
`;

const StyledTableColumnHeader = styled.th`
  color: ${theme.colors.textTertiary};
  font-size: ${theme.text.s};
  line-height: ${theme.lineHeight.s};
  font-weight: ${theme.fontWeight.bold};
  padding: ${theme.spacing.spacing4} 0;
  text-align: left;
  position: relative;
  padding-left: ${theme.spacing.spacing4};

  &:last-of-type {
    text-align: right;
    padding-right: ${theme.spacing.spacing4};
  }
`;

const StyledTableCell = styled.td`
  color: ${theme.colors.textPrimary};
  padding-top: ${theme.spacing.spacing4};
  padding-bottom: ${theme.spacing.spacing4};
  vertical-align: middle;
  padding-left: ${theme.spacing.spacing4};

  &:last-of-type {
    text-align: right;
    padding-right: ${theme.spacing.spacing4};
  }
`;

const StyledTableHeaderRow = styled.tr`
  background-color: ${theme.table.header.bg};
`;

type StyledTableRowProps = {
  $isHovered: boolean;
};

const StyledTableRow = styled.tr<StyledTableRowProps>`
  outline: none;
  font-size: ${theme.text.s};
  line-height: ${theme.lineHeight.s};

  &:nth-child(odd) {
    background-color: ${({ $isHovered }) => ($isHovered ? theme.table.row.bgHover : theme.table.row.odd.bg)};
  }

  &:nth-child(even) {
    background-color: ${({ $isHovered }) => ($isHovered ? theme.table.row.bgHover : theme.table.row.even.bg)};
  }

  &:focus-visible {
    background-color: ${theme.table.row.bgHover};
  }
`;

export { StyledTable, StyledTableCell, StyledTableColumnHeader, StyledTableHeaderRow, StyledTableRow };
