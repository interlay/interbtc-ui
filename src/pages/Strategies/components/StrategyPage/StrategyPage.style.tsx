import styled from 'styled-components';

import { Card, theme } from '@/component-library';

const StyledStrategyPageLayout = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${theme.spacing.spacing6};
  gap: ${theme.spacing.spacing6};
`;

const StyledStrategyPageMainContent = styled.div`
  display: grid;
  gap: ${theme.spacing.spacing6};
  @media (min-width: 80em) {
    grid-template-columns: 1fr 1fr;
  }
`;

const StyledStrategyPageInformation = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.spacing6};
`;

const StyledStrategyPageInfoCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.spacing2};
`;

export {
  StyledStrategyPageInfoCard,
  StyledStrategyPageInformation,
  StyledStrategyPageLayout,
  StyledStrategyPageMainContent
};
