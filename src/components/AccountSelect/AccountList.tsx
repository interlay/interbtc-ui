import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import Identicon from '@polkadot/react-identicon';

import { shortAddress } from '@/common/utils/utils';
import { Flex } from '@/component-library/Flex';
import { ListItem, ListProps } from '@/component-library/List';

import { StyledList, StyledListAccountWrapper, StyledListItemLabel } from './AccountInput.style';

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
            gap='spacing4'
          >
            <StyledListAccountWrapper alignItems='center' gap='spacing2' flex='1'>
              <StyledListItemLabel $isSelected={isSelected}>{accountText}</StyledListItemLabel>
            </StyledListAccountWrapper>
            <Flex direction='column' alignItems='flex-end' gap='spacing2' flex='0'>
              <Identicon size={32} value={item.address} theme='polkadot' />
              {item.meta.name} {shortAddress(item.address.toString())}
              <StyledListItemLabel $isSelected={isSelected}>
                {shortAddress(item.address.toString())}
              </StyledListItemLabel>
            </Flex>
          </ListItem>
        );
      })}
    </StyledList>
  );
};

export { AccountList };
export type { AccountListProps };
