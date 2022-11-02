import styled from 'styled-components';

import { H2, Span, Stack, theme } from '@/component-library';

const StyledApyTag = styled(Span)`
  border-radius: ${theme.rounded.full};
  padding: ${theme.spacing.spacing2};
  background-color: ${theme.card.secondaryBg};
  align-self: flex-start;
`;

const StyledAsset = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${theme.spacing.spacing4};
`;

const StyledTablesWrapper = styled.section`
  display: flex;
  gap: ${theme.spacing.spacing6};
  flex-direction: column;

  @media (min-width: 80em) {
    flex-direction: row;
  }
`;

const StyledTableWrapper = styled(Stack)`
  flex: 1;
`;

const StyledMarketTitle = styled(H2)`
  font-size: ${theme.text.xl2};
`;

const StyledSubLabel = styled(Span)`
  font-size: ${theme.text.s};
`;

export { StyledApyTag, StyledAsset, StyledMarketTitle, StyledSubLabel, StyledTablesWrapper, StyledTableWrapper };
