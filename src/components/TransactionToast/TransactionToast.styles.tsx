import styled from 'styled-components';

import { CTA, CTALink, Flex, ProgressBar, theme } from '@/component-library';

const StyledWrapper = styled(Flex)`
  padding: ${theme.spacing.spacing4};
`;

const StyledCTA = styled(CTA)`
  padding-left: ${0};
  padding-right: ${0};
  flex: 1;
`;

const StyledCTALink = styled(CTALink)`
  padding-left: ${0};
  padding-right: ${0};
  flex: 1;
`;

const StyledProgressBar = styled(ProgressBar)`
  margin-top: ${theme.spacing.spacing4};
`;

export { StyledCTA, StyledCTALink, StyledProgressBar, StyledWrapper };
