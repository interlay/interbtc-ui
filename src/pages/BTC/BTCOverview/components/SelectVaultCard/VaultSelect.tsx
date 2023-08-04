import { useTranslation } from 'react-i18next';

import { Item, Select, SelectProps } from '@/component-library';
import { BridgeVaultData } from '@/hooks/api/bridge/use-get-vaults';

import { VaultListItem } from './VaultListItem';

type VaultSelectProps = Omit<SelectProps<'modal', BridgeVaultData>, 'children' | 'type'>;

const VaultSelect = (props: VaultSelectProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Select<'modal', BridgeVaultData> {...props} type='modal' modalTitle={t('btc.select_vault')} size='large'>
      {(data: BridgeVaultData) => (
        <Item key={data.id} textValue={data.vaultId.accountId.toString()}>
          <VaultListItem data={data} />
        </Item>
      )}
    </Select>
  );
};

VaultSelect.displayName = 'VaultSelect';

export { VaultSelect };
export type { VaultSelectProps };
