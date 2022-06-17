import styled from 'styled-components';
import { theme } from 'componentLibrary';

interface CTAProps {
  fullWidth: boolean;
}

const BaseCTA = styled.div<CTAProps>`
  color: ${theme.cta.primary.text};
  border: none;
  border-radius: ${theme.rounded.md};
  font-family: ${theme.font.primary};
  font-size: ${theme.text.base};
  font-weight: ${theme.fontWeight.medium};
  line-height: ${theme.lineHeight.base};
  padding: ${theme.spacing.spacing3} ${theme.spacing.spacing10};
  text-decoration: none;
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};
`;

export const PrimaryCTA = styled(BaseCTA)`
  background-color: ${theme.cta.primary.bg};

  &:hover {
    background-color: ${theme.cta.primary.bgHover};
  }
`;

export const SecondaryCTA = styled(BaseCTA)`
  background-color: ${theme.cta.secondary.bg};
`;
