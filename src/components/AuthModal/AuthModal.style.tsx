import styled from 'styled-components';

import { CTA, Flex, theme } from '@/component-library';

const StyledItem = styled(Flex)`
  border: 1px solid #ffffff;
  border-radius: ${theme.rounded.md};
  cursor: pointer;
`;

const StyledAccountItem = styled(StyledItem)`
  padding: ${theme.spacing.spacing2};
`;

const StyledCopyItem = styled(StyledItem)`
  padding: ${theme.spacing.spacing5};
`;

const StyledCTA = styled(CTA)`
  border: 1px solid #ffffff;
`;

export { StyledAccountItem, StyledCopyItem, StyledCTA, StyledItem };
