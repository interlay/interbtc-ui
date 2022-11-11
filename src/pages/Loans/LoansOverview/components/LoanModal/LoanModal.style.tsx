import styled from 'styled-components';

import { Flex, Tabs, theme } from '@/component-library';

const StyledTabs = styled(Tabs)`
  margin-top: ${theme.spacing.spacing6};
`;

const StyledWrapper = styled.div`
  margin-top: ${theme.spacing.spacing6};
`;

const StyledFormWrapper = styled(Flex)`
  margin-top: ${theme.spacing.spacing8};
`;

export { StyledFormWrapper, StyledTabs, StyledWrapper };
