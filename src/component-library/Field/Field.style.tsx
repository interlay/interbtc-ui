import styled from 'styled-components';

import { theme } from '../theme';
import { Spacing } from '../utils/prop-types';

type StyledFieldProps = {
  $maxWidth?: Spacing;
};

const StyledField = styled.div<StyledFieldProps>`
  position: relative;
  color: ${theme.colors.textPrimary};
  box-sizing: border-box;
  display: inline-flex;
  max-width: ${({ $maxWidth }) => $maxWidth && theme.spacing[$maxWidth]};
`;

export { StyledField };
