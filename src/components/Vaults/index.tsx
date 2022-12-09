import { BitcoinAmount } from '@interlay/monetary-js';
import clsx from 'clsx';
import * as React from 'react';
import { FieldError } from 'react-hook-form';

import { VaultApiType } from '@/common/types/vault.types';
import { TreasuryAction } from '@/types/general';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import STATUSES from '@/utils/constants/statuses';

import VaultSelector from './VaultsSelector';

interface Props {
  label: string;
  requiredCapacity: BitcoinAmount;
  isShown: boolean;
  onSelectionCallback: (vault: VaultApiType | undefined) => void;
  error?: FieldError;
  // ray test touch <
  treasuryAction: TreasuryAction;
  // ray test touch >
}

const Vaults = ({
  label,
  requiredCapacity,
  isShown,
  onSelectionCallback,
  error,
  treasuryAction
}: Props): JSX.Element => {
  const [selectedVault, setSelectedVault] = React.useState<VaultApiType | undefined>(undefined);
  const [allVaults, setAllVaults] = React.useState<VaultApiType[]>([]);
  const [vaultsStatus, setVaultsStatus] = React.useState(STATUSES.IDLE);

  const availableVaults = React.useMemo(() => {
    // Filters out vaults with lower than required capacity and sorts by accountId
    // to have vaults with the same accountId grouped together
    return allVaults
      .filter((vault) => vault[1].gt(BitcoinAmount.zero())) // TODO: redundant check
      .filter((vault) => vault[1].gte(requiredCapacity))
      .sort((vaultA, vaultB) => {
        const vaultAId = vaultA[0].accountId.toString();
        const vaultBId = vaultB[0].accountId.toString();
        return vaultAId < vaultBId ? -1 : vaultAId > vaultBId ? 1 : 0;
      });
  }, [allVaults, requiredCapacity]);

  const handleVaultSelection = React.useCallback(
    (newVault: VaultApiType | undefined) => {
      setSelectedVault(newVault);
      onSelectionCallback(newVault);
    },
    [onSelectionCallback]
  );

  React.useEffect(() => {
    (async () => {
      setVaultsStatus(STATUSES.PENDING);
      // ray test touch <
      let theAllVaults;
      if (treasuryAction === 'issue') {
        theAllVaults = await window.bridge.vaults.getVaultsWithIssuableTokens();
      } else if (treasuryAction === 'redeem') {
        theAllVaults = await window.bridge.vaults.getVaultsWithRedeemableTokens();
      } else {
        throw new Error(`Invalid treasuryAction (${treasuryAction})`);
      }
      // ray test touch >
      setAllVaults(Array.from(theAllVaults));
      setVaultsStatus(STATUSES.RESOLVED);
    })();
  }, [treasuryAction]);

  return (
    <div className='w-full'>
      {/* Keeping the component mounted at all times to prevent refetching of the vaults */}
      {isShown && (
        <>
          <VaultSelector
            isPending={vaultsStatus === STATUSES.PENDING}
            label={label}
            selectedVault={selectedVault}
            vaults={availableVaults}
            onChange={handleVaultSelection}
            error={!!error}
          />
          <p
            className={clsx(
              'pt-1',
              'h-6',
              'text-sm',
              { 'text-interlayCinnabar': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
              { 'text-kintsugiThunderbird': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
            )}
          >
            {error?.message}
          </p>
        </>
      )}
    </div>
  );
};

export default Vaults;
