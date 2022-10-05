import styled from 'styled-components';

import { theme } from '../theme';

type StyledHelperTextProps = {
  $hasError?: boolean;
};

const StyledHelperText = styled.div<StyledHelperTextProps>`
  font-weight: ${theme.fontWeight.medium};
  line-height: ${theme.lineHeight.lg};
  font-size: ${theme.text.xs};
  color: ${(props) => (props.$hasError ? theme.input.helperText.error.color : theme.colors.textTertiary)};
  padding: ${theme.spacing.spacing1} 0;
`;

const StyledSubHelperText = styled.p`
  line-height: ${theme.lineHeight.s};
`;

export { StyledHelperText, StyledSubHelperText };
