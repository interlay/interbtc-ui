import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import Identicon from '@polkadot/react-identicon';

import { Span } from '@/component-library';
import { Flex } from '@/component-library/Flex';
import { ListItem, ListProps } from '@/component-library/List';

import { StyledList, StyledListChainWrapper, StyledListItemLabel } from './ChainInput.style';

type Props = {
  items: InjectedAccountWithMeta[];
  selectedChain?: string;
  onSelectionChange?: (chain: string) => void;
};

type InheritAttrs = Omit<ListProps, keyof Props | 'children'>;

type ChainListProps = Props & InheritAttrs;

const ChainList = ({ items, selectedChain, onSelectionChange, ...props }: ChainListProps): JSX.Element => {
  const handleSelectionChange: ListProps['onSelectionChange'] = (key) => {
    const [selectedKey] = [...key];

    if (!selectedKey) return;

    onSelectionChange?.(selectedKey as string);
  };

  return (
    <StyledList
      aria-label='select chain'
      variant='secondary'
      selectionMode='single'
      onSelectionChange={handleSelectionChange}
      selectedKeys={selectedChain ? [selectedChain] : undefined}
      {...props}
    >
      {items.map((item) => {
        const chainText = item.address;

        const isSelected = selectedChain === chainText;

        return (
          <ListItem
            key={chainText}
            textValue={chainText}
            alignItems='center'
            justifyContent='space-between'
            gap='spacing4'
          >
            <StyledListChainWrapper alignItems='center' gap='spacing2' flex='1'>
              <Identicon size={32} value={item.address} theme='polkadot' />
              <Flex direction='column'>
                <StyledListItemLabel $isSelected={isSelected}>{item.meta.name}</StyledListItemLabel>
                <Span size='xs' color='tertiary'>
                  {item.address}
                </Span>
              </Flex>
            </StyledListChainWrapper>
          </ListItem>
        );
      })}
    </StyledList>
  );
};

export { ChainList };
export type { ChainListProps };
