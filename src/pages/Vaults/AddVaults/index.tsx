import { NewVaultsTable } from 'component-library';
import { useGetAvailableVaults } from 'utils/hooks/api/use-get-available-vaults';

interface AddVaultProps {
  vaults: any;
}

const isVaultActive = (vaults: any, currentVault: any) => {
  const vaultActive = vaults?.some((vault: any) => vault.collateralId === currentVault.collateralCurrency);

  return vaultActive ? true : false;
};

const AddVaults = ({ vaults }: AddVaultProps): JSX.Element => {
  const availableVaults = useGetAvailableVaults();

  return (
    <NewVaultsTable
      data={availableVaults.map((vault) => ({
        collateralCurrency: vault.collateralCurrency,
        wrappedCurrency: vault.wrappedCurrency,
        minCollateralAmount: vault.minimumCollateral.toNumber().toFixed(2),
        collateralRate: vault.secureCollateralThreshold.toNumber().toFixed(2),
        isActive: isVaultActive(vaults, vault),
        isInstalled: true,
        ctaOnClick: () => {
          return undefined;
        }
      }))}
    />
  );
};

export { AddVaults };
