// ray test touch <
import { BitcoinAmount } from '@interlay/monetary-js';
import clsx from 'clsx';
import { FieldError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { VaultApiType } from '@/common/types/vault.types';
import Checkbox, { CheckboxLabelSide } from '@/components/Checkbox';
import VaultsSelector from '@/components/VaultsSelector';
import { TreasuryAction } from '@/types/general';

interface Props {
  disabled: boolean;
  checked: boolean;
  treasuryAction: TreasuryAction;
  requiredCapacity: BitcoinAmount;
  error?: FieldError;
  onSelectionCallback: (vault: VaultApiType | undefined) => void;
  onCheckboxChange: () => void;
}

const ManualVaultSelectUI = ({
  disabled,
  checked,
  treasuryAction,
  requiredCapacity,
  error,
  onSelectionCallback,
  onCheckboxChange
}: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className={clsx('flex', 'flex-col', 'items-end', 'gap-2')}>
      <Checkbox
        label={t('issue_page.manually_select_vault')}
        labelSide={CheckboxLabelSide.LEFT}
        disabled={disabled}
        type='checkbox'
        checked={checked}
        onChange={onCheckboxChange}
      />
      <VaultsSelector
        label={t('select_vault')}
        requiredCapacity={requiredCapacity}
        isShown={checked}
        onSelectionCallback={onSelectionCallback}
        error={error}
        treasuryAction={treasuryAction}
      />
    </div>
  );
};

export default ManualVaultSelectUI;
// ray test touch >
