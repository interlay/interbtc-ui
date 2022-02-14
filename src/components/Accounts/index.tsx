
import * as React from 'react';
import clsx from 'clsx';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import { shortAddress } from 'common/utils/utils';
import useGetAccounts from 'utils/hooks/use-get-accounts';
import Select, {
  SelectButton,
  SelectOptions,
  SelectOption,
  SelectBody,
  SelectCheck,
  SelectText,
  SELECT_VARIANTS
} from 'components/Select';

const AccountSelector = (): JSX.Element => {
  const [selectedAccount, setSelectedAccount] = React.useState<InjectedAccountWithMeta | undefined>(undefined);
  const accounts = useGetAccounts();

  React.useEffect(() => {
    if (!accounts) return;
    if (selectedAccount) return;

    setSelectedAccount(accounts[0]);
  }, [
    accounts,
    selectedAccount
  ]);

  return (
    <>
      {accounts && selectedAccount ? (
        <Select
          variant={SELECT_VARIANTS.formField}
          key={selectedAccount.meta.name}
          value={selectedAccount}
          onChange={setSelectedAccount}>
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
                                {selectedAccount.meta.name}
                              </SelectText>
                              <SelectText>
                                {shortAddress(selectedAccount.address.toString())}
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
        </Select>) :
        null}
    </>
  );
};

export default AccountSelector;
