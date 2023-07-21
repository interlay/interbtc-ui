import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import { Select, SelectProps } from '@/component-library';

import { AccountItem } from './AccountItem';

type AccountSelectProps = Omit<SelectProps<'modal', InjectedAccountWithMeta>, 'children' | 'type'>;

const AccountSelect = (props: AccountSelectProps): JSX.Element => {
  return (
    <Select<'modal', any> {...props} type='modal' modalTitle='Select Account' size='large'>
      {(data: InjectedAccountWithMeta) => <AccountItem address={data.address} name={data.meta.name} />}
    </Select>
  );
};

AccountSelect.displayName = 'AccountSelect';

export { AccountSelect };
export type { AccountSelectProps };
