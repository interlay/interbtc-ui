import styled from 'styled-components';

import { Span, Stack, theme } from '@/component-library';

const StyledApyTag = styled(Span)`
  border-radius: ${theme.rounded.full};
  padding: ${theme.spacing.spacing2};
  background-color: ${theme.colors.bgPrimary};
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
  flex-direction: row;
  gap: ${theme.spacing.spacing6};
`;

const StyledTableWrapper = styled(Stack)`
  flex: 1;
`;

export { StyledApyTag, StyledAsset, StyledTablesWrapper, StyledTableWrapper };
