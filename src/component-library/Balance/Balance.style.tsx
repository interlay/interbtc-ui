import styled from 'styled-components';

import { theme } from 'component-library';
import { spaceX } from 'component-library/css';

const BalanceWrapper = styled.dl`
  display: flex;
  font-weight: ${theme.fontWeight.book};
  ${spaceX('spacing1')}
`;

const BalanceLabel = styled.dt`
  color: ${theme.colors.textPrimary};
`;

const BalanceValue = styled.dd`
  color: ${theme.colors.textSecondary};
`;

export { BalanceLabel, BalanceValue, BalanceWrapper };
