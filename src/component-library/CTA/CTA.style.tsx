import styled from 'styled-components';

import { theme } from '../theme';
import { Sizes } from '../utils/prop-types';

interface StyledCTAProps {
  $fullWidth: boolean;
  $size: Sizes;
}

const BaseCTA = styled.button<StyledCTAProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${theme.cta.primary.text};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  border: none;
  border-radius: ${theme.rounded.md};
  font-size: ${(props) => theme.cta[props.$size].text};
  font-weight: ${theme.fontWeight.medium};
  line-height: ${(props) => theme.cta[props.$size].lineHeight};
  padding: ${(props) => theme.cta[props.$size].padding};
  text-decoration: none;
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};
  opacity: ${(props) => (props.disabled ? '50%' : '100%')};

  &[disabled] {
    pointer-events: none;
  }
`;

const PrimaryCTA = styled(BaseCTA)`
  background-color: ${theme.cta.primary.bg};

  &:hover:not([disabled]) {
    background-color: ${theme.cta.primary.bgHover};
  }
`;

const SecondaryCTA = styled(BaseCTA)`
  background-color: ${theme.cta.secondary.bg};
  color: ${theme.cta.secondary.text};
`;

const OutlinedCTA = styled(BaseCTA)`
  color: ${theme.cta.outlined.text};
  border: ${theme.cta.outlined.border};
  background: none;

  &:hover:not([disabled]) {
    background-color: ${theme.cta.outlined.bgHover};
  }
`;

const LoadingWrapper = styled.span`
  display: flex;
  align-items: center;
  margin-right: ${theme.spacing.spacing2};
`;

export { LoadingWrapper, OutlinedCTA, PrimaryCTA, SecondaryCTA };
export type { StyledCTAProps };
