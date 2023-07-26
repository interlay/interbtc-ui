import { useTranslation } from 'react-i18next';

import { Card, SwitchProps } from '@/component-library';
import { BridgeVaultData } from '@/hooks/api/bridge/use-get-vaults';

import { VaultSelect, VaultSelectProps } from './VaultSelect';
import { StyledSwitch } from './VaultSelect.style';

type SelectVaultCardProps = {
  isSelectingVault?: boolean;
  vaults: BridgeVaultData[] | undefined;
  switchProps: SwitchProps;
  selectProps: VaultSelectProps;
};

const SelectVaultCard = ({ vaults, isSelectingVault, switchProps, selectProps }: SelectVaultCardProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Card
      direction='column'
      variant='bordered'
      background='tertiary'
      rounded='lg'
      gap='spacing4'
      padding='spacing4'
      shadowed={false}
      flex='1'
    >
      <StyledSwitch isSelected={isSelectingVault} labelProps={{ size: 'xs' }} {...switchProps}>
        {t('btc.manually_select_vault')}
      </StyledSwitch>
      {isSelectingVault && vaults && (
        <VaultSelect items={vaults} placeholder={t('btc.select_a_vault')} aria-label='Vault' {...selectProps} />
      )}
    </Card>
  );
};

SelectVaultCard.displayName = 'SelectVaultCard';

export { SelectVaultCard };
export type { SelectVaultCardProps };
