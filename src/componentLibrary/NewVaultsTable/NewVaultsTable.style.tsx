import styled from 'styled-components';
import { theme } from 'componentLibrary';

const CoinPairWrapper = styled.div`
  display: flex;
  gap: ${theme.spacing.spacing2};
  align-items: center;
  font-weight: ${theme.fontWeight.medium};
  white-space: nowrap;
`;

interface NumericValueProps {
  highlight?: boolean;
}

const NumericValue = styled.div<NumericValueProps>`
  color: ${(props) => (props.highlight ? theme.newVaultsTable.highlightColor : 'inherit')};
  font-weight: ${theme.fontWeight.medium};
`;

const AddVaultButton = styled.div`
  border-radius: 20px;
`;

export { CoinPairWrapper, NumericValue, AddVaultButton };
