import styled from 'styled-components';

import { theme } from '../theme';

const TableWrapper = styled.div`
  background: ${theme.colors.bgPrimary};
  color: ${theme.colors.textPrimary};
  border: ${theme.table.border};
  border-radius: ${theme.rounded.lg};
  line-height: ${theme.lineHeight.base};
  overflow: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-bottom: ${theme.spacing.spacing8};
`;

const TableHeader = styled.th`
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.textTertiary};
  text-align: start;
  padding: ${theme.spacing.spacing4} ${theme.spacing.spacing4};
`;

const TableRow = styled.tr`
  border-bottom: ${theme.table.border};
`;

const TableCell = styled.td`
  vertical-align: middle;
  text-align: start;
  padding: ${theme.spacing.spacing4} ${theme.spacing.spacing4};
`;

export { StyledTable, TableCell, TableHeader, TableRow, TableWrapper };
