import styled from 'styled-components';

import { Card, Flex, theme } from '@/component-library';

const StyledWrapper = styled(Flex)`
  max-width: 560px;
  width: 100%;
  margin: 0 auto;
`;

const StyledCard = styled(Card)`
  width: 100%;
`;

const StyledFormWrapper = styled.div`
  margin-top: ${theme.spacing.spacing8};
`;

export { StyledCard, StyledFormWrapper, StyledWrapper };
