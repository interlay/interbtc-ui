import styled from 'styled-components';

import { H1, theme } from '@/component-library';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledTitle = styled(H1)`
  font-weight: ${theme.fontWeight.bold};
  font-size: ${theme.text.xl3};
  line-height: ${theme.lineHeight.xl};
`;

export { StyledTitle, StyledWrapper };
