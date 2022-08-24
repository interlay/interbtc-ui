import styled from 'styled-components';

import { Card, P, Strong, theme } from '@/component-library';

import { CollateralScore } from '../CollateralScore';

const StyledWrapper = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${theme.spacing.spacing6};
`;

const StyledCollateralWrapper = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${theme.spacing.spacing4};
  padding: ${theme.spacing.spacing4};
`;

const StyledCollateralScore = styled(CollateralScore)`
  max-width: 312px;
`;

const StyledLiquidationPrice = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${theme.spacing.spacing2};
  color: ${theme.colors.textPrimary};
`;

const StyledLiquidationText = styled(P)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${theme.spacing.spacing2};
  font-size: ${theme.text.xs};
  line-height: ${theme.lineHeight.s};
`;

const StyledCoinPairs = styled(Strong)`
  font-weight: ${theme.fontWeight.bold};
  font-size: ${theme.text.s};
  line-height: ${theme.lineHeight.s};
`;

const StyledCTAGroups = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: ${theme.spacing.spacing4};
  border-top: ${theme.border.default};

  @media (min-width: 80em) {
    flex-direction: row;
    border-top: ${theme.border.default};
  }
`;

const StyledCTAGroup = styled.div`
  display: flex;
  flex: 1;
  gap: ${theme.spacing.spacing4};
  flex-wrap: wrap;

  &:first-of-type {
    padding-bottom: ${theme.spacing.spacing4};
  }

  @media (min-width: 30em) {
    flex-wrap: nowrap;
  }

  @media (min-width: 80em) {
    &:first-of-type {
      border-bottom: 0;
      border-right: ${theme.border.default};
      padding-right: ${theme.spacing.spacing4};
      padding-bottom: 0;
      margin-right: ${theme.spacing.spacing4};
    }
  }
`;

export {
  StyledCoinPairs,
  StyledCollateralScore,
  StyledCollateralWrapper,
  StyledCTAGroup,
  StyledCTAGroups,
  StyledLiquidationPrice,
  StyledLiquidationText,
  StyledWrapper
};
