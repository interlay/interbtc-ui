import styled from 'styled-components';

import { theme } from '../theme';

const StyledHelperText = styled.div`
  font-weight: ${theme.fontWeight.medium};
  line-height: ${theme.lineHeight.lg};
  font-size: ${theme.text.xs};
  color: ${theme.colors.textTertiary};
  padding: ${theme.spacing.spacing1} 0;
`;

export { StyledHelperText };
