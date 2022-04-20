import styled from 'styled-components';
import { theme } from 'componentLibrary';

const BaseCTA = styled.button`
  border-radius: ${theme.rounded.md};
  font-size: ${theme.text.base};
  padding: ${theme.spacing.spacing3};
`;

export const PrimaryCTA = styled(BaseCTA)`
  background-color: ${theme.colors.ctaPrimary};
  color: ${theme.colors.textPrimary};
`;

export const SecondaryCTA = styled(BaseCTA)`
  background-color: ${theme.colors.ctaSecondary};
  color: ${theme.colors.textPrimary};
`;
