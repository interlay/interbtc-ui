import styled from 'styled-components';

import { Flex, ProgressBar, theme } from '@/component-library';

const StyledWrapper = styled(Flex)`
  padding: ${theme.spacing.spacing4};
`;

const StyledProgressBar = styled(ProgressBar)`
  margin-top: ${theme.spacing.spacing4};
`;

export { StyledProgressBar, StyledWrapper };
