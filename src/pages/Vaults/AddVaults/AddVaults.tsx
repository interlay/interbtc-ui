import { CollateralIdLiteral } from '@interlay/interbtc-api';
import { useId } from '@react-aria/utils';
import { useState } from 'react';

import { H2, Modal } from '@/component-library';
import { AvailableVaultData, useGetAvailableVaults } from '@/utils/hooks/api/use-get-available-vaults';
import { VaultData } from '@/utils/hooks/api/vaults/get-vault-data';

import { VaultsTable, VaultsTableProps, VaultsTableRow } from './VaultsTable';

const isVaultInstalled = (vaults: VaultData[], currentVault: AvailableVaultData) =>
  vaults?.some((vault) => vault.collateralId === currentVault.collateralCurrency);

type Props = {
  vaults?: VaultData[];
};

type InheritAttrs = Omit<VaultsTableProps, keyof Props | 'data' | 'onClickAddVault'>;

type AddVaultsProps = Props & InheritAttrs;

const AddVaults = ({ vaults = [], ...props }: AddVaultsProps): JSX.Element => {
  const titleId = useId();
  const availableVaults = useGetAvailableVaults();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = useState<CollateralIdLiteral | undefined>(undefined);

  const handleOpenModal = (currency: CollateralIdLiteral) => {
    setModalOpen(true);
    setSelectedCurrency(currency);
  };

  const onModalClose = () => {
    setModalOpen(false);
    setSelectedCurrency(undefined);
  };

  const handleClickAddVault = (vault: VaultsTableRow) =>
    handleOpenModal(vault.collateralCurrency as CollateralIdLiteral);

  const data: VaultsTableRow[] = availableVaults.map((vault) => ({
    collateralCurrency: vault.collateralCurrency,
    wrappedCurrency: vault.wrappedCurrency,
    minCollateralAmount: vault.minimumCollateral.toNumber().toFixed(2),
    collateralRate: vault.secureCollateralThreshold.toNumber().toFixed(2),
    isActive: true,
    isInstalled: isVaultInstalled(vaults, vault)
  }));

  return (
    <section>
      <H2 id={titleId}>Create a vault</H2>
      <VaultsTable {...props} aria-labelledby={titleId} onClickAddVault={handleClickAddVault} data={data} />
      <Modal open={modalOpen} onClose={onModalClose}>
        {selectedCurrency}
      </Modal>
    </section>
  );
};

export { AddVaults };
