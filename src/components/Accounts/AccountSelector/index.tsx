import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { KeyringPair } from '@polkadot/keyring/types';
import clsx from 'clsx';

import { shortAddress } from '@/common/utils/utils';
import Select, {
  SELECT_VARIANTS,
  SelectBody,
  SelectButton,
  SelectCheck,
  SelectLabel,
  SelectOption,
  SelectOptions,
  SelectText
} from '@/components/Select';

interface Props {
  accounts: Array<InjectedAccountWithMeta>;
  selectedAccount: KeyringPair;
  label: string;
  onChange: (account: KeyringPair) => void;
}

const AccountSelector = ({ accounts, selectedAccount, label, onChange }: Props): JSX.Element => (
  <Select
    variant={SELECT_VARIANTS.formField}
    key={selectedAccount.meta.name as string}
    value={selectedAccount}
    onChange={onChange}
  >
    {({ open }) => (
      <>
        <SelectLabel>{label}</SelectLabel>
        <SelectBody>
          <SelectButton variant={SELECT_VARIANTS.formField}>
            <span className={clsx('flex', 'justify-between', 'py-2')}>
              <SelectText>{selectedAccount.meta.name as string}</SelectText>
              <SelectText>{shortAddress(selectedAccount.address.toString())}</SelectText>
            </span>
          </SelectButton>
          <SelectOptions className='h-28' open={open}>
            {accounts.map((account: InjectedAccountWithMeta) => {
              return (
                <SelectOption key={account.meta.name} value={account}>
                  {({ selected, active }) => (
                    <>
                      <span className={clsx('flex', 'justify-between', 'mr-4')}>
                        <SelectText>{account.meta.name}</SelectText>
                        <SelectText>{shortAddress(account.address.toString())}</SelectText>
                      </span>
                      {selected ? <SelectCheck active={active} /> : null}
                    </>
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

export default AccountSelector;
