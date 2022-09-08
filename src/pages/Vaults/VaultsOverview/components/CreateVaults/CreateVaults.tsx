import { useId } from '@react-aria/utils';
import { useState } from 'react';

import { H2, Modal } from '@/component-library';
import { AvailableVaultData, useGetAvailableVaults } from '@/utils/hooks/api/use-get-available-vaults';
import { VaultData } from '@/utils/hooks/api/vaults/get-vault-data';

import { CreateVaultWizard } from '../CreateVaultWizard';
import { VaultsTable, VaultsTableProps, VaultsTableRow } from '../VaultsTable/VaultsTable';

const isVaultInstalled = (vaults: VaultData[], currentVault: AvailableVaultData) =>
  vaults?.some((vault) => vault.collateralId === currentVault.collateralCurrency);

type Props = {
  vaults?: VaultData[];
};

type InheritAttrs = Omit<VaultsTableProps, keyof Props | 'data' | 'onClickAddVault'>;

type CreateVaultsProps = Props & InheritAttrs;

// TODO: should not show to read-only
const CreateVaults = ({ vaults = [], ...props }: CreateVaultsProps): JSX.Element => {
  const titleId = useId();
  const availableVaults = useGetAvailableVaults();
  const [{ open, data: selectedVault }, setCollateralModal] = useState<{ data: VaultsTableRow; open: boolean }>({
    data: {} as VaultsTableRow,
    open: false
  });

  const handleClickAddVault = (vault: VaultsTableRow) => setCollateralModal({ open: true, data: vault });

  const handleCloseModal = () => setCollateralModal((s) => ({ ...s, open: false }));

  const data: VaultsTableRow[] = availableVaults.map((vault) => ({
    collateralCurrency: vault.collateralCurrency,
    wrappedCurrency: vault.wrappedCurrency,
    minCollateralAmount: vault.minimumCollateral.toNumber().toFixed(2),
    collateralRate: vault.secureCollateralThreshold.toNumber().toFixed(2),
    isActive: true,
    // TODO: restore function
    // eslint-disable-next-line no-constant-condition
    isInstalled: false ? isVaultInstalled(vaults, vault) : false
  }));

  return (
    <section>
      <H2 id={titleId}>Create a vault</H2>
      <VaultsTable {...props} aria-labelledby={titleId} onClickAddVault={handleClickAddVault} data={data} />
      <Modal open={open} onClose={handleCloseModal}>
        <CreateVaultWizard vault={selectedVault} />
      </Modal>
    </section>
  );
};

export { CreateVaults };
export type { CreateVaultsProps };
