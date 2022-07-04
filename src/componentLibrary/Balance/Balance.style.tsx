import styled from 'styled-components';

import { theme } from 'componentLibrary';

const BalanceWrapper = styled.dl`
  display: flex;
  font-weight: ${theme.fontWeight.book};
`;

const BalanceLabel = styled.dt`
  color: ${theme.colors.textPrimary};
`;

const BalanceValue = styled.dd`
  margin-left: ${theme.spacing.spacing1};
  color: ${theme.colors.textSecondary};
`;

export { BalanceLabel, BalanceValue, BalanceWrapper };
