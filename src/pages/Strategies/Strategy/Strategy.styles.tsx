import styled from 'styled-components';

import { theme } from '@/component-library';

import { StrategyInfographicsCard, StrategyRiskCard } from '../components';
import { StrategyForm } from '../components/StrategyForm';
import { StrategyLeverageStats } from '../components/StrategyLeverageStats';

const StyledFlex = styled.div`
  display: flex;
  gap: ${theme.spacing.spacing4};
  flex-direction: column;

  @media ${theme.breakpoints.up('lg')} {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto auto;
  }
`;

const StyledStrategyForm = styled(StrategyForm)`
  height: min-content;
  order: 2;

  @media ${theme.breakpoints.up('lg')} {
    order: 1;
    grid-column: 1;
    grid-row: span 4;
  }
`;

const StyledStrategyLeverageStats = styled(StrategyLeverageStats)`
  height: min-content;
  order: 1;

  @media ${theme.breakpoints.up('lg')} {
    order: 2;
  }
`;

const StyledStrategyInfographicsCard = styled(StrategyInfographicsCard)`
  height: min-content;
  order: 3;
`;

const StyledStrategyRiskCard = styled(StrategyRiskCard)`
  height: min-content;
  order: 4;
`;

export {
  StyledFlex,
  StyledStrategyForm,
  StyledStrategyInfographicsCard,
  StyledStrategyLeverageStats,
  StyledStrategyRiskCard
};
