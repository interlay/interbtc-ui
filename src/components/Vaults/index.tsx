import * as React from 'react';
import { BitcoinAmount } from '@interlay/monetary-js';
import VaultSelector from './VaultsSelector';
import { VaultApiType } from '../../common/types/vault.types';

interface Props {
  label: string;
  requiredCapacity: string;
  isShown: boolean;
  onSelectionCallback: (vault: VaultApiType | undefined) => void;
}

const Vaults = ({ label, requiredCapacity, isShown, onSelectionCallback }: Props): JSX.Element => {
  const [selectedVault, setSelectedVault] = React.useState<VaultApiType | undefined>(undefined);
  const [allVaults, setAllVaults] = React.useState<VaultApiType[]>([]);
  const [availableVaults, setAvailableVaults] = React.useState<VaultApiType[]>([]);
  const [loadingVaults, setLoadingVaults] = React.useState<boolean>(false);

  const handleVaultSelection = React.useCallback((vault: VaultApiType | undefined) => {
    setSelectedVault(vault);
    onSelectionCallback(vault);
  }, [onSelectionCallback]);

  React.useEffect(() => {
    (async () => {
      setLoadingVaults(true);
      const availableVaults = await window.bridge.vaults.getVaultsWithIssuableTokens();
      setAllVaults(Array.from(availableVaults));
      setLoadingVaults(false);
    })();
  }, []);

  React.useEffect(() => {
    // filters out vaults with lower than required capacity and sorts by accountId
    // to have vaults with same accountId grouped together
    const vaultsWithEnoughCapacity = allVaults
      .filter(vault => vault[1].gte(BitcoinAmount.from.Satoshi(requiredCapacity)))
      .sort((vaultA, vaultB) => {
        const vaultAId = vaultA[0].accountId.toString();
        const vaultBId = vaultB[0].accountId.toString();
        return (vaultAId < vaultBId ? -1 : (vaultAId > vaultBId ? 1 : 0));
      });

    setAvailableVaults(vaultsWithEnoughCapacity);
  }, [allVaults, requiredCapacity]);

  React.useEffect(() => {
    // deselects the vault when it doesn't have required capacity
    if (selectedVault !== undefined &&
      !availableVaults.some(vault => vault[0].accountId === selectedVault[0].accountId)) {
      handleVaultSelection(undefined);
    }
  }, [availableVaults, selectedVault, handleVaultSelection]);

  return (
    <div className='w-full'>
      {/* Keeping the component mounted at all times to prevent refetching of the vaults */}
      {isShown && <VaultSelector
        loading={loadingVaults}
        label={label}
        selectedVault={selectedVault}
        vaults={availableVaults}
        onChange={handleVaultSelection} />
      }
    </div>

  );
};

export default Vaults;
