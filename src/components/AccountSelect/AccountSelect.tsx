import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import { Item, Select, SelectProps } from '@/component-library';

import { AccountItem } from './AccountItem';

type AccountSelectProps = Omit<SelectProps<'modal', InjectedAccountWithMeta>, 'children' | 'type'>;

const AccountSelect = ({ ...props }: AccountSelectProps): JSX.Element => {
  return (
    <Select<'modal', InjectedAccountWithMeta> {...props} type='modal' modalTitle='select account' size='large'>
      {(data: InjectedAccountWithMeta) => (
        <Item key={data.address} textValue={data.address}>
          <AccountItem address={data.address} name={data.meta.name} />
        </Item>
      )}
    </Select>
  );
};

AccountSelect.displayName = 'AccountSelect';

export { AccountSelect };
export type { AccountSelectProps };
