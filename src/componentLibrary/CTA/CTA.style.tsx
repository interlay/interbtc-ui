import styled from 'styled-components';
import { theme } from 'componentLibrary/theme';

const BaseCTA = styled.button`
  background-color: ${theme.colors.ctaPrimary};
  border-radius: ${theme.rounded.md};
  color: ${theme.colors.textPrimary};
  font-size: ${theme.text.base};
  padding: ${theme.spacing.spacing3};
`;

export const PrimaryCTA = styled(BaseCTA)``;
