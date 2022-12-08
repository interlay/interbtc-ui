import styled from 'styled-components';

import { theme } from '@/component-library';

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

export { StyledTablesWrapper };
