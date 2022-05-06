import clsx from 'clsx';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { VaultApiType } from '../../../common/types/vault.types';
import { shortAddress } from '../../../common/utils/utils';
import Select, {
  SelectBody,
  SelectButton,
  SelectCheck,
  SelectLabel,
  SelectOption,
  SelectOptions,
  SelectText,
  SELECT_VARIANTS
} from '../../Select';

interface Props {
  vaults: VaultApiType[];
  label: string;
  onChange: (vault: VaultApiType) => void;
  selectedVault: VaultApiType | undefined;
  loading: boolean;
}

interface VaultOptionProps {
  vault: VaultApiType | undefined;
}
const VaultOption = ({ vault }: VaultOptionProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    vault ?
      <span
        className={clsx(
          'flex',
          'items-center'
        )}>
        <CheckCircleIcon
          className={clsx(
            'flex-shrink-0',
            'w-4',
            'h-4',
            'mr-2',
            'text-interlayConifer-600'
          )} />
        <SelectText className='w-44 tracking-normal'>
          <strong>
            {shortAddress(vault[0].accountId.toString())}
          </strong>
        </SelectText>
        <SelectText>
          {vault[0].currencies.collateral.asToken.toString()}
        </SelectText>
      </span> : t('select_vault')

  );
};

const VaultSelector = ({ label, vaults, onChange, selectedVault, loading }: Props): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Select
      variant={SELECT_VARIANTS.formField}
      value={selectedVault}
      onChange={onChange}>
      {({ open }) => (
        <>
          <SelectLabel className='sr-only'>{label}</SelectLabel>
          <SelectBody>
            <SelectButton variant={SELECT_VARIANTS.formField}>
              <span className={clsx('flex', 'justify-between', 'py-2')}>
                {loading ?
                  t('loading_ellipsis') :
                  vaults.length > 0 ?
                    <VaultOption vault={selectedVault} /> :
                    t('not_enough_vault_capacity')
                }
              </span>

            </SelectButton>
            <SelectOptions
              className='h-28'
              open={open}>
              {vaults.map((vault: VaultApiType) => {
                return (
                  <SelectOption
                    key={vault[0].toString()}
                    value={vault}>
                    {({ selected, active }) => (
                      <span className={clsx('flex', 'justify-between', 'mr-4')}>
                        <VaultOption vault={vault} />
                        {selected ? <SelectCheck active={active} /> : null}
                      </span>
                    )}
                  </SelectOption>
                );
              })}
            </SelectOptions>
          </SelectBody>
        </>
      )}
    </Select>
  );
};

export default VaultSelector;
