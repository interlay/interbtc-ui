
import * as React from 'react';
import clsx from 'clsx';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import { shortAddress } from 'common/utils/utils';
import Select, {
  SelectButton,
  SelectOptions,
  SelectOption,
  SelectBody,
  SelectCheck,
  SelectText,
  SELECT_VARIANTS
} from 'components/Select';

interface Props {
  accounts: Array<InjectedAccountWithMeta>;
  selectedAccount: InjectedAccountWithMeta;
  onChange: (account: InjectedAccountWithMeta) => void;
}

const AccountSelector = ({
  accounts,
  selectedAccount,
  onChange
}: Props): JSX.Element => (
  <Select
    variant={SELECT_VARIANTS.formField}
    key={selectedAccount.meta.name}
    value={selectedAccount}
    onChange={onChange}>
    {({ open }) => (
      <>
        <SelectBody>
          <SelectButton variant={SELECT_VARIANTS.formField}>
            <span
              className={clsx(
                'flex',
                'justify-between',
                'py-2'
              )}>
              <SelectText>
                {selectedAccount.meta.name}
              </SelectText>
              <SelectText>
                {shortAddress(selectedAccount.address.toString())}
              </SelectText>
            </span>
          </SelectButton>
          <SelectOptions open={open}>
            {accounts.map((account: InjectedAccountWithMeta) => {
              return (
                <SelectOption
                  key={account.meta.name}
                  value={account}>
                  {({
                    selected,
                    active
                  }) => (
                    <>
                      <span
                        className={clsx(
                          'flex',
                          'justify-between',
                          'mr-4'
                        )}>
                        <SelectText>
                          {account.meta.name}
                        </SelectText>
                        <SelectText>
                          {shortAddress(account.address.toString())}
                        </SelectText>
                      </span>
                      {selected ? (
                        <SelectCheck active={active} />
                      ) : null}
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
