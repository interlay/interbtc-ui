import styled from 'styled-components';
import { theme } from 'componentLibrary';

const CoinPairWrapper = styled.div`
  display: flex;
  gap: ${theme.spacing.spacing2};
  align-items: center;
`;
interface NumericValueProps {
  variant: 'primary' | 'secondary';
}

const NumericValue = styled.div<NumericValueProps>`
  color: ${(props) => (props.variant === 'primary' ? theme.colors.textPrimary : theme.colors.textSecondary)};
  font-weight: ${theme.fontWeight.bold};
  font: ${theme.font};
`;

const AddVaultButton = styled.div`
  border-radius: 20px;
`;

export { CoinPairWrapper, NumericValue, AddVaultButton };
