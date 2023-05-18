import styled from 'styled-components';

import { H2, theme } from '@/component-library';
import { AuthCTA } from '@/components';

const StyledRewardsTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${theme.spacing.spacing4};
`;

const StyledStakingTitle = styled(H2)`
  font-size: ${theme.text.lg};
  line-height: ${theme.lineHeight.base};
  font-weight: ${theme.fontWeight.bold};
`;

type StyledCTAProps = {
  $loading: boolean;
};

const StyledCTA = styled(AuthCTA)<StyledCTAProps>`
  position: relative;
  padding-left: ${(props) => props.$loading && theme.spacing.spacing8};
`;

const StyledLoadingSpinnerWrapper = styled.span`
  position: absolute;
  left: ${theme.spacing.spacing2};
`;

export { StyledCTA, StyledLoadingSpinnerWrapper, StyledRewardsTitleWrapper, StyledStakingTitle };
