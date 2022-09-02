import styled from 'styled-components';

import { theme } from '@/component-library';

import { Rewards, VaultCollateral } from './components';

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

const StyledRewards = styled(Rewards)`
  flex: 0.3;
`;

export { StyledCollateralSection, StyledRewards, StyledVaultCollateral };
