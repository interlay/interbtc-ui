import Identicon from '@polkadot/react-identicon';

import { Flex, Item, Select, SelectProps } from '@/component-library';
import { useSelectModalContext } from '@/component-library/Select/SelectModalContext';
import { BridgeVaultData } from '@/utils/hooks/api/bridge/use-get-vaults';

import { StyledChain, StyledListChainWrapper, StyledListItemLabel } from './VaultSelect.style';

type VaultSelectProps = Omit<SelectProps<BridgeVaultData>, 'children' | 'type'>;

const ListItem = ({ data }: { data: BridgeVaultData }) => {
  const isSelected = useSelectModalContext().selectedItem?.key === data.id;

  return (
    <StyledListChainWrapper alignItems='center' gap='spacing4' flex='1'>
      <Flex gap='spacing2'>
        <Identicon size={24} value={data.id.accountId.toString()} theme='polkadot' />
        <StyledListItemLabel $isSelected={isSelected}>{data.id.accountId.toString()}</StyledListItemLabel>
      </Flex>
    </StyledListChainWrapper>
  );
};

const Value = ({ data }: { data: BridgeVaultData }) => (
  <Flex elementType='span' alignItems='center' justifyContent='space-evenly' gap='spacing2'>
    <Identicon size={24} value={data.id.accountId.toString()} theme='polkadot' />
    <StyledChain>{data.id.accountId.toString()}</StyledChain>
  </Flex>
);

const VaultSelect = ({ ...props }: VaultSelectProps): JSX.Element => {
  return (
    <Flex direction='column' flex='1'>
      <Select<BridgeVaultData>
        {...props}
        type='modal'
        renderValue={(item) => <Value data={item.value} />}
        modalTitle='Select Token'
      >
        {(data: BridgeVaultData) => (
          <Item key={data.id} textValue={data.id.accountId.toString()}>
            <ListItem data={data} />
          </Item>
        )}
      </Select>
    </Flex>
  );
};

VaultSelect.displayName = 'VaultSelect';

export { VaultSelect };
export type { VaultSelectProps };
