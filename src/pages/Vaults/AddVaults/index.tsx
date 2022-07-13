import { useState } from 'react';
import { NewVaultsTable, Modal } from 'component-library';
import { useGetAvailableVaults } from 'utils/hooks/api/use-get-available-vaults';
import { CollateralIdLiteral } from '@interlay/interbtc-api';

interface AddVaultProps {
  vaults: any;
}

const isVaultInstalled = (vaults: any, currentVault: any) =>
  vaults?.some((vault: any) => vault.collateralId === currentVault.collateralCurrency);

const AddVaults = ({ vaults }: AddVaultProps): JSX.Element => {
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
  const availableVaults = useGetAvailableVaults();

  return (
    <>
      <NewVaultsTable
        data={availableVaults.map((vault) => ({
          collateralCurrency: vault.collateralCurrency,
          wrappedCurrency: vault.wrappedCurrency,
          minCollateralAmount: vault.minimumCollateral.toNumber().toFixed(2),
          collateralRate: vault.secureCollateralThreshold.toNumber().toFixed(2),
          isActive: true,
          isInstalled: isVaultInstalled(vaults, vault),
          ctaOnClick: () => handleOpenModal(vault.collateralCurrency)
        }))}
      />
      <Modal open={modalOpen} onClose={onModalClose}>
        {selectedCurrency}
      </Modal>
    </>
  );
};

export { AddVaults };
