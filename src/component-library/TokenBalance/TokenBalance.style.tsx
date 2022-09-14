import styled from 'styled-components';

import { theme } from '../theme';

const TokenBalanceWrapper = styled.dl`
  display: inline-flex;
  font-weight: ${theme.fontWeight.book};
  gap: ${theme.spacing.spacing1};
`;

const TokenBalanceLabel = styled.dt`
  color: ${theme.colors.textPrimary};
`;

type TokenBalanceValueProps = {
  $clickable?: boolean;
};

const TokenBalanceValue = styled.span<TokenBalanceValueProps>`
  color: ${theme.colors.textSecondary};
  cursor: ${(props) => props.$clickable && 'pointer'};
`;

export { TokenBalanceLabel, TokenBalanceValue, TokenBalanceWrapper };
