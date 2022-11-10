import styled from 'styled-components';

import { Flex, Meter, Span, Tabs, theme } from '@/component-library';

const StyledDl = styled.dl`
  display: flex;
  flex-direction: column;
  background-color: ${theme.card.secondaryBg};
  padding: ${theme.spacing.spacing4};
  gap: ${theme.spacing.spacing2};
  min-height: 7.5rem;
`;

const StyledDItem = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${theme.spacing.spacing2};
`;

const StyledMeterWrapper = styled.div`
  display: flex;
  gap: ${theme.spacing.spacing4};
`;

const StyledTabs = styled(Tabs)`
  margin-top: ${theme.spacing.spacing6};
`;

const StyledWrapper = styled.div`
  margin-top: ${theme.spacing.spacing6};
`;

const StyledMeterScore = styled(Span)`
  flex: 0 0 ${theme.spacing.spacing4};
`;

const StyledMeter = styled(Meter)`
  flex: 1 1 auto;
`;

const StyledFormWrapper = styled(Flex)`
  margin-top: ${theme.spacing.spacing8};
`;

export {
  StyledDItem,
  StyledDl,
  StyledFormWrapper,
  StyledMeter,
  StyledMeterScore,
  StyledMeterWrapper,
  StyledTabs,
  StyledWrapper
};
