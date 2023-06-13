import { Card, SwitchProps } from '@/component-library';
import { BridgeVaultData } from '@/utils/hooks/api/bridge/use-get-vaults';

import { VaultSelect, VaultSelectProps } from './VaultSelect';
import { StyledSwitch } from './VaultSelect.style';

type SelectVaultCardProps = {
  isSelectingVault?: boolean;
  availableVaults: BridgeVaultData[] | undefined;
  switchProps: SwitchProps;
  selectProps: VaultSelectProps;
};

const SelectVaultCard = ({
  availableVaults,
  isSelectingVault,
  switchProps,
  selectProps
}: SelectVaultCardProps): JSX.Element => (
  <Card
    direction='column'
    variant='bordered'
    background='tertiary'
    rounded='lg'
    gap='spacing4'
    padding='spacing4'
    flex='1'
  >
    <StyledSwitch isSelected={isSelectingVault} labelProps={{ size: 'xs' }} {...switchProps}>
      Manually Select Vault
    </StyledSwitch>
    {isSelectingVault && availableVaults && (
      <VaultSelect items={availableVaults} placeholder='Select a vault' aria-label='Vault' {...selectProps} />
    )}
  </Card>
);

SelectVaultCard.displayName = 'SelectVaultCard';

export { SelectVaultCard };
export type { SelectVaultCardProps };
