import { Flex } from '@/component-library/Flex';
import { ListItem, ListProps } from '@/component-library/List';
import { Chains } from '@/types/chains';

import { ChainIcon } from '../ChainIcon';
import { StyledList, StyledListChainWrapper, StyledListItemLabel } from './ChainSelect.style';

type Props = {
  items: Chains;
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
        const chainText = item.id;

        const isSelected = selectedChain === chainText;

        return (
          <ListItem
            key={chainText}
            textValue={chainText}
            alignItems='center'
            justifyContent='space-between'
            gap='spacing4'
          >
            <StyledListChainWrapper alignItems='center' gap='spacing4' flex='1'>
              <Flex gap='spacing2'>
                <ChainIcon id={item.id} />
                <StyledListItemLabel $isSelected={isSelected}>{item.display}</StyledListItemLabel>
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
