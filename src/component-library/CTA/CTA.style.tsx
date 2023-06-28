import styled from 'styled-components';

import { LoadingSpinner } from '../LoadingSpinner';
import { theme } from '../theme';
import { CTASizes, CTAVariants } from '../utils/prop-types';

interface StyledCTAProps {
  $fullWidth: boolean;
  $size: CTASizes;
  $isFocusVisible?: boolean;
}

type StyledLoadingSpinnerProps = {
  $variant: CTAVariants;
};

const BaseCTA = styled.button<StyledCTAProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${theme.cta.primary.text};
  border: none;
  border-radius: ${theme.rounded.md};
  font-size: ${(props) => theme.cta[props.$size].text};
  font-weight: ${theme.fontWeight.medium};
  line-height: ${(props) => theme.cta[props.$size].lineHeight};
  padding: ${(props) => theme.cta[props.$size].padding};
  text-decoration: none;
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};
  background: none;
  // TODO: enforce outline
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

const StyledLoadingSpinner = styled(LoadingSpinner)<StyledLoadingSpinnerProps>`
  border-top-color: ${({ $variant }) => theme.cta[$variant].text};
  border-right-color: ${({ $variant }) => theme.cta[$variant].text};
  border-bottom-color: ${({ $variant }) => theme.cta[$variant].text};
  border-left-color: transparent;
`;

export { LoadingWrapper, OutlinedCTA, PrimaryCTA, SecondaryCTA, StyledLoadingSpinner, TextCTA };
export type { StyledCTAProps };
