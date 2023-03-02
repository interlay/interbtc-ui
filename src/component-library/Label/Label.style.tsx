import styled from 'styled-components';

import { visuallyHidden } from '../css';
import { theme } from '../theme';

type StyledLabelProps = {
  $isVisuallyHidden?: boolean;
};

const StyledLabel = styled.label<StyledLabelProps>`
  font-weight: ${theme.fontWeight.medium};
  line-height: ${theme.lineHeight.lg};
  font-size: ${theme.text.xs};
  color: ${theme.colors.textTertiary};
  padding: ${theme.spacing.spacing1} 0;
  ${({ $isVisuallyHidden }) => $isVisuallyHidden && visuallyHidden()}
`;

export { StyledLabel };
