import styled from 'styled-components';

import { Tabs, theme } from '@/component-library';

const StyledTabs = styled(Tabs)`
  padding: ${theme.spacing.spacing14} ${theme.modal.header.paddingX} ${theme.modal.footer.paddingBottom};
`;

const StyledWrapper = styled.div`
  margin-top: ${theme.spacing.spacing2};
`;

export { StyledTabs, StyledWrapper };
