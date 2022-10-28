import { useId } from '@react-aria/utils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { H3, Modal, Stack } from '@/component-library';
import { VaultData } from '@/utils/hooks/api/vaults/get-vault-data';
import { AvailableVaultData, useGetAvailableVaults } from '@/utils/hooks/api/vaults/use-get-available-vaults';

import { CreateVaultWizard } from '../CreateVaultWizard';
import { VaultsTable, VaultsTableProps, VaultsTableRow } from '../VaultsTable/VaultsTable';

// Can this be consolidated with the vault account check at the app level?
const isVaultInstalled = (vaults: VaultData[], currentVault: AvailableVaultData) =>
  vaults?.some((vault) => vault.collateralId === currentVault.collateralCurrency.ticker);

type Props = {
  vaults?: VaultData[];
};

type InheritAttrs = Omit<VaultsTableProps, keyof Props | 'data' | 'onClickAddVault'>;

type CreateVaultsProps = Props & InheritAttrs;

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
    collateralRate: vault.secureCollateralThreshold.mul(100).toNumber().toFixed(2),
    isActive: true,
    isInstalled: isVaultInstalled(vaults, vault)
  }));

  return (
    <Stack spacing='double'>
      <H3 id={titleId}>{t('vault.create_vault')}</H3>
      {/* ray test touch < */}
      <VaultsTable {...props} aria-labelledby={titleId} onClickAddVault={handleClickAddVault} data={data} />
      {/* ray test touch > */}
      <Modal open={open} onClose={handleCloseModal}>
        <CreateVaultWizard vault={selectedVault} />
      </Modal>
    </Stack>
  );
};

export { CreateVaults };
export type { CreateVaultsProps };
