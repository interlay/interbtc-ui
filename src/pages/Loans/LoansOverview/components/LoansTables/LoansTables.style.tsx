import styled from 'styled-components';

import { theme } from '@/component-library';
import { LoanPositionsTable } from '@/components';

const StyledBorrowPositionsTable = styled(LoanPositionsTable)`
  grid-area: borrow-positions-table;
`;

const StyledLendPositionsTable = styled(LoanPositionsTable)`
  grid-area: lend-positions-table;
`;

type StyledTablesWrapperProps = {
  $hasPositions: boolean;
};

const StyledTablesWrapper = styled.div<StyledTablesWrapperProps>`
  display: grid;
  gap: ${theme.spacing.spacing6};
  grid-template-areas: ${({ $hasPositions }) =>
    $hasPositions
      ? `'lend-positions-table'
              'lend-assets-table'
              'borrow-positions-table' 
              'borrow-assets-table'`
      : `'lend-assets-table'
            'borrow-assets-table'`};

  @media (min-width: 80em) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    grid-template-areas: ${({ $hasPositions }) =>
      $hasPositions
        ? `'lend-positions-table borrow-positions-table'
                'lend-assets-table borrow-assets-table'`
        : `'lend-assets-table borrow-assets-table'`};
  }
`;

export { StyledBorrowPositionsTable, StyledLendPositionsTable, StyledTablesWrapper };
