import styled from 'styled-components';

import { theme } from '@/component-library';
import { LoanPositionsTable } from '@/components';

import { BorrowAssetsTable } from '../BorrowAssetsTable';
import { LendAssetsTable } from '../LendAssetsTable';

const StyledBorrowPositionsTable = styled(LoanPositionsTable)`
  grid-area: borrow-positions-table;
`;

const StyledLendPositionsTable = styled(LoanPositionsTable)`
  grid-area: lend-positions-table;
`;

const StyledBorrowAssetsTable = styled(BorrowAssetsTable)`
  grid-area: borrow-assets-table;
`;

const StyledLendAssetsTable = styled(LendAssetsTable)`
  grid-area: lend-assets-table;
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

export {
  StyledBorrowAssetsTable,
  StyledBorrowPositionsTable,
  StyledLendAssetsTable,
  StyledLendPositionsTable,
  StyledTablesWrapper
};
