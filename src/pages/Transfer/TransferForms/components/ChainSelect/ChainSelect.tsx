import { Flex } from '@/component-library';
import { Item, Select, SelectProps } from '@/component-library';
import { useSelectModalContext } from '@/component-library/Select/SelectModalContext';
import { ChainData } from '@/types/chains';

import { ChainIcon } from '../ChainIcon';
import { StyledChain, StyledListChainWrapper, StyledListItemLabel } from './ChainSelect.style';

type ChainSelectProps = Omit<SelectProps<'modal', ChainData>, 'children' | 'type'>;

const ListItem = ({ data }: { data: ChainData }) => {
  const isSelected = useSelectModalContext().selectedItem?.key === data.id;

  return (
    <StyledListChainWrapper alignItems='center' gap='spacing4' flex='1'>
      <Flex gap='spacing2'>
        <ChainIcon id={data.id} />
        <StyledListItemLabel $isSelected={isSelected}>{data.display}</StyledListItemLabel>
      </Flex>
    </StyledListChainWrapper>
  );
};

const Value = ({ data }: { data: ChainData }) => (
  <Flex elementType='span' alignItems='center' justifyContent='space-evenly' gap='spacing2'>
    <ChainIcon id={data.id} />
    <StyledChain>{data.display}</StyledChain>
  </Flex>
);

const ChainSelect = ({ ...props }: ChainSelectProps): JSX.Element => {
  return (
    <Flex direction='column' flex='1'>
      <Select<'modal', ChainData>
        {...props}
        type='modal'
        renderValue={(item) => <Value data={item.value} />}
        modalTitle='Select Token'
      >
        {(data: ChainData) => (
          <Item key={data.id} textValue={data.display}>
            <ListItem data={data} />
          </Item>
        )}
      </Select>
    </Flex>
  );
};

ChainSelect.displayName = 'ChainSelect';

export { ChainSelect };
export type { ChainSelectProps };
