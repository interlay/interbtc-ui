import styled from 'styled-components';

import { theme } from '../theme';

const TokenBalanceWrapper = styled.dl`
  display: flex;
  font-weight: ${theme.fontWeight.book};
  gap: ${theme.spacing.spacing1};
`;

const TokenBalanceLabel = styled.dt`
  color: ${theme.colors.textPrimary};
`;

const TokenBalanceValue = styled.dd`
  color: ${theme.colors.textSecondary};
`;

export { TokenBalanceLabel, TokenBalanceValue, TokenBalanceWrapper };
