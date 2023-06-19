import { useTranslation } from 'react-i18next';

import { SwitchProps } from '@/component-library';
import { BridgeVaultData } from '@/utils/hooks/api/bridge/use-get-vaults';

import { VaultSelect, VaultSelectProps } from './VaultSelect';
import { StyledCard, StyledSwitch } from './VaultSelect.style';

type SelectVaultCardProps = {
  isSelectingVault?: boolean;
  vaults: BridgeVaultData[] | undefined;
  switchProps: SwitchProps;
  selectProps: VaultSelectProps;
};

const SelectVaultCard = ({ vaults, isSelectingVault, switchProps, selectProps }: SelectVaultCardProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <StyledCard
      direction='column'
      variant='bordered'
      background='tertiary'
      rounded='lg'
      gap='spacing4'
      padding='spacing4'
      flex='1'
    >
      <StyledSwitch isSelected={isSelectingVault} labelProps={{ size: 'xs' }} {...switchProps}>
        {t('bridge.manually_select_vault')}
      </StyledSwitch>
      {isSelectingVault && vaults && (
        <VaultSelect items={vaults} placeholder={t('bridge.select_a_vault')} aria-label='Vault' {...selectProps} />
      )}
    </StyledCard>
  );
};

SelectVaultCard.displayName = 'SelectVaultCard';

export { SelectVaultCard };
export type { SelectVaultCardProps };
