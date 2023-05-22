import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import { ListItem, ListProps } from '@/component-library/List';

import { AccountLabel } from './AccountLabel';
import { StyledList } from './AccountSelect.style';

type Props = {
  items: InjectedAccountWithMeta[];
  selectedAccount?: string;
  onSelectionChange?: (account: string) => void;
};

type InheritAttrs = Omit<ListProps, keyof Props | 'children'>;

type AccountListProps = Props & InheritAttrs;

const AccountList = ({ items, selectedAccount, onSelectionChange, ...props }: AccountListProps): JSX.Element => {
  const handleSelectionChange: ListProps['onSelectionChange'] = (key) => {
    const [selectedKey] = [...key];

    if (!selectedKey) return;

    onSelectionChange?.(selectedKey as string);
  };

  return (
    <StyledList
      aria-label='select account'
      variant='secondary'
      selectionMode='single'
      onSelectionChange={handleSelectionChange}
      selectedKeys={selectedAccount ? [selectedAccount] : undefined}
      {...props}
    >
      {items.map((item) => {
        const accountText = item.address;

        const isSelected = selectedAccount === accountText;

        return (
          <ListItem
            key={accountText}
            textValue={accountText}
            alignItems='center'
            justifyContent='space-between'
            gap='spacing2'
          >
            <AccountLabel isSelected={isSelected} address={item.address} name={item.meta.name} />
          </ListItem>
        );
      })}
    </StyledList>
  );
};

export { AccountList };
export type { AccountListProps };
