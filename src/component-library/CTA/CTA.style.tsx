import styled from 'styled-components';

import { theme } from '../theme';
import { Sizes } from '../utils/prop-types';

interface StyledCTAProps {
  $fullWidth: boolean;
  $size: Sizes;
  $isFocusVisible?: boolean;
  $hasIcon: boolean;
}

const BaseCTA = styled.button<StyledCTAProps>`
  display: inline-flex;
  position: relative;
  align-items: center;
  justify-content: center;
  color: ${theme.cta.primary.text};
  border: none;
  border-radius: ${theme.rounded.md};
  font-size: ${(props) => theme.cta[props.$size].text};
  font-weight: ${theme.fontWeight.medium};
  /* line-height: ${(props) => theme.cta[props.$size].lineHeight}; */
  line-height: 1.5;
  padding: ${({ $size, $hasIcon }) => ($hasIcon ? theme.cta.icon[$size].padding : theme.cta[$size].padding)};
  text-decoration: none;
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};
  background: none;
  outline: ${({ $isFocusVisible }) => !$isFocusVisible && 'none'};

  &[aria-disabled='true'],
  &[disabled] {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 50%;
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

  &:hover:not([disabled]) {
    background-color: ${theme.cta.outlined.bgHover};
  }
`;

const TextCTA = styled(BaseCTA)`
  color: ${theme.cta.text.text};

  &:hover:not([disabled]) {
    background-color: ${theme.cta.text.bgHover};
  }
`;

const LoadingWrapper = styled.span`
  display: flex;
  align-items: center;
  margin-right: ${theme.spacing.spacing2};
`;

const StyledIconLoadingWrapper = styled.span`
  display: inline-flex;
  /* line-height: ${theme.icon.sizes.lg}; */
`;

export { LoadingWrapper, OutlinedCTA, PrimaryCTA, SecondaryCTA, StyledIconLoadingWrapper, TextCTA };
export type { StyledCTAProps };
