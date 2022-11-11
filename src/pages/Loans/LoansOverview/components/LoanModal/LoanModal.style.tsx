import styled from 'styled-components';

import { Flex, Meter, Span, Tabs, theme } from '@/component-library';

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

export { StyledFormWrapper, StyledMeter, StyledMeterScore, StyledTabs, StyledWrapper };
