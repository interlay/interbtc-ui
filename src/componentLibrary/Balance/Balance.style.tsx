import styled from 'styled-components';

import { theme } from 'componentLibrary';

const BalanceWrapper = styled.dl`
  display: flex;
  font-family: ${theme.font.primary};
  font-weight: ${theme.fontWeight.book};
`;

const BalanceLabel = styled.dt`
  color: ${theme.colors.textSecondary};
`;

const BalanceValue = styled.dd`
  margin-left: ${theme.spacing.spacing1};
  color: ${theme.colors.textAccent};
`;

export { BalanceLabel, BalanceValue, BalanceWrapper };
