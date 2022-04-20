import styled from 'styled-components';
import { theme } from 'componentLibrary/theme';

const BaseCTA = styled.button`
  background-color: ${theme.colors.primary};
`;

export const PrimaryCTA = styled(BaseCTA)``;

export const SecondaryCTA = styled(BaseCTA)`
  background-color: ${theme.colors.background}
`;
