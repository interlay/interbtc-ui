import { Flex, Item, Select, SelectProps } from '@/component-library';
import { BridgeVaultData } from '@/utils/hooks/api/bridge/use-get-vaults';

import { VaultListItem } from './VaultListItem';

type VaultSelectProps = Omit<SelectProps<BridgeVaultData>, 'children' | 'type'>;

const VaultSelect = (props: VaultSelectProps): JSX.Element => {
  return (
    <Flex direction='column' flex='1'>
      <Select<BridgeVaultData> {...props} type='modal' modalTitle='Select Token' size='large'>
        {(data: BridgeVaultData) => (
          <Item key={data.id} textValue={data.vaultId.accountId.toString()}>
            <VaultListItem data={data} />
          </Item>
        )}
      </Select>
    </Flex>
  );
};

VaultSelect.displayName = 'VaultSelect';

export { VaultSelect };
export type { VaultSelectProps };
