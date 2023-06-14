import Identicon from '@polkadot/react-identicon';

import { CoinIcon, Flex } from '@/component-library';
import { useSelectModalContext } from '@/component-library/Select/SelectModalContext';
import { BridgeVaultData } from '@/utils/hooks/api/bridge/use-get-vaults';

import {
  StyledListLabelWrapper,
  StyledListWrapper,
  StyledVaultAddress,
  StyledVaultIcon,
  StyledVaultName
} from './VaultSelect.style';

type VaultListItemProps = { data: BridgeVaultData };

const VaultListItem = ({ data }: VaultListItemProps): JSX.Element => {
  const { id, vaultId, collateralCurrency, amount } = data;

  const isSelected = useSelectModalContext().selectedItem?.key === id;

  const accountAddress = vaultId.accountId.toString();

  return (
    <StyledListWrapper flex='1' elementType='span' alignItems='center' gap='spacing3'>
      <StyledVaultIcon justifyContent='center' elementType='span'>
        <Identicon size={24} value={accountAddress} theme='polkadot' />
        <CoinIcon ticker={collateralCurrency.ticker} />
      </StyledVaultIcon>
      <StyledListLabelWrapper elementType='span' direction='column' gap='spacing1'>
        <Flex gap='spacing1' justifyContent='space-between'>
          <StyledVaultName size='s' $isSelected={isSelected}>
            {collateralCurrency.ticker} Vault
          </StyledVaultName>
          <StyledVaultName size='s' $isSelected={isSelected}>
            {amount.toHuman()} BTC
          </StyledVaultName>
        </Flex>
        <StyledVaultAddress color='tertiary' size='xs'>
          {accountAddress}
        </StyledVaultAddress>
      </StyledListLabelWrapper>
    </StyledListWrapper>
  );
};

export { VaultListItem };
export type { VaultListItemProps };
