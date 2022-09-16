import { useId } from '@react-aria/utils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { H3, Modal, Stack } from '@/component-library';
import { AvailableVaultData, useGetAvailableVaults } from '@/utils/hooks/api/use-get-available-vaults';
import { VaultData } from '@/utils/hooks/api/vaults/get-vault-data';

import { CreateVaultWizard } from '../CreateVaultWizard';
import { VaultsTable, VaultsTableProps, VaultsTableRow } from '../VaultsTable/VaultsTable';

const isVaultInstalled = (vaults: VaultData[], currentVault: AvailableVaultData) =>
  vaults?.some((vault) => vault.collateralId === currentVault.collateralCurrency.ticker);

type Props = {
  vaults?: VaultData[];
};

type InheritAttrs = Omit<VaultsTableProps, keyof Props | 'data' | 'onClickAddVault'>;

type CreateVaultsProps = Props & InheritAttrs;

// TODO: should not show to read-only
const CreateVaults = ({ vaults = [], ...props }: CreateVaultsProps): JSX.Element => {
  const titleId = useId();
  const { t } = useTranslation();
  const availableVaults = useGetAvailableVaults();
  const [{ open, data: selectedVault }, setCollateralModal] = useState<{ data?: VaultsTableRow; open: boolean }>({
    data: undefined,
    open: false
  });

  const handleClickAddVault = (vault: VaultsTableRow) => setCollateralModal({ open: true, data: vault });

  const handleCloseModal = () => setCollateralModal((s) => ({ ...s, open: false }));

  const data: VaultsTableRow[] = availableVaults.map((vault) => ({
    collateralCurrency: vault.collateralCurrency,
    wrappedCurrency: vault.wrappedCurrency,
    minCollateralAmount: vault.minimumCollateral,
    collateralRate: vault.secureCollateralThreshold.toNumber().toFixed(2),
    isActive: true,
    // TODO: restore function
    // eslint-disable-next-line no-constant-condition
    isInstalled: false ? isVaultInstalled(vaults, vault) : false
  }));

  return (
    <Stack spacing='double'>
      <H3 id={titleId}>{t('create_vault')}</H3>
      <VaultsTable {...props} aria-labelledby={titleId} onClickAddVault={handleClickAddVault} data={data} />
      <Modal open={open} onClose={handleCloseModal}>
        <CreateVaultWizard vault={selectedVault} />
      </Modal>
    </Stack>
  );
};

export { CreateVaults };
export type { CreateVaultsProps };
