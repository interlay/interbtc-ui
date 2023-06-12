import { Item, Select, SelectProps } from '@/component-library';
import { BridgeVaultData } from '@/utils/hooks/api/bridge/use-get-vaults';

import { VaultListItem } from './VaultListItem';

type VaultSelectProps = Omit<SelectProps<BridgeVaultData>, 'children' | 'type'>;

const VaultSelect = (props: VaultSelectProps): JSX.Element => (
  <Select<BridgeVaultData> {...props} type='modal' modalTitle='Select Vault' size='large'>
    {(data: BridgeVaultData) => (
      <Item key={data.id} textValue={data.vaultId.accountId.toString()}>
        <VaultListItem data={data} />
      </Item>
    )}
  </Select>
);

VaultSelect.displayName = 'VaultSelect';

export { VaultSelect };
export type { VaultSelectProps };
