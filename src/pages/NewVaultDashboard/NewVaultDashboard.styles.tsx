import styled from 'styled-components';

import { H2, theme } from '@/component-library';

import { InsightsList, VaultCollateral } from './components';

const StyledCollateralSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.spacing4};

  @media (min-width: 80em) {
    flex-direction: row;
  }
`;

const StyledVaultCollateral = styled(VaultCollateral)`
  flex: 0.7;
`;

const StyledStackingInsightsList = styled(InsightsList)`
  flex: 0.3;
`;

const StyledStakingTitleWrapper = styled.div`
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

export {
  StyledCollateralSection,
  StyledStackingInsightsList,
  StyledStakingTitle,
  StyledStakingTitleWrapper,
  StyledVaultCollateral
};
