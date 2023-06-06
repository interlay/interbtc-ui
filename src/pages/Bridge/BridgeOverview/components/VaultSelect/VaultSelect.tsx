import { CurrencyExt } from '@interlay/interbtc-api';
import Identicon from '@polkadot/react-identicon';

import { CoinIcon, Flex, Item, Select, SelectProps } from '@/component-library';
import { useSelectModalContext } from '@/component-library/Select/SelectModalContext';
import { BridgeVaultData } from '@/utils/hooks/api/bridge/use-get-vaults';

import {
  StyledListLabelWrapper,
  StyledListWrapper,
  StyledVaultAddress,
  StyledVaultIcon,
  StyledVaultName
} from './VaultSelect.style';

const getVaultKey = (data: BridgeVaultData) => `${data.id.accountId.toString()}-${data.collateralCurrency.ticker}`;

const VaultIcon = ({ id, currency }: { id: string; currency: CurrencyExt }) => (
  <StyledVaultIcon justifyContent='center' elementType='span'>
    <Identicon size={24} value={id} theme='polkadot' />
    <CoinIcon ticker={currency.ticker} />
  </StyledVaultIcon>
);

const ListItem = ({ data }: { data: BridgeVaultData }) => {
  const key = getVaultKey(data);

  const isSelected = useSelectModalContext().selectedItem?.key === key;

  return (
    <StyledListWrapper elementType='span' alignItems='center' gap='spacing2'>
      <VaultIcon id={data.id.accountId.toString()} currency={data.collateralCurrency} />
      <StyledListLabelWrapper elementType='span' direction='column' gap='spacing1' flex='1'>
        <Flex gap='spacing1' justifyContent='space-between'>
          <StyledVaultName size='s' $isSelected={isSelected}>
            {data.collateralCurrency.ticker} Vault
          </StyledVaultName>
          <StyledVaultName size='s' $isSelected={isSelected}>
            {data.amount.toHuman()} BTC
          </StyledVaultName>
        </Flex>
        <StyledVaultAddress color='tertiary' size='xs'>
          {data.id.accountId.toString()}
        </StyledVaultAddress>
      </StyledListLabelWrapper>
    </StyledListWrapper>
  );
};

type VaultSelectProps = Omit<SelectProps<BridgeVaultData>, 'children' | 'type'>;
const VaultSelect = ({ onSelectionChange, items, ...props }: VaultSelectProps): JSX.Element => {
  // const handleSelectionChange = (key: Key) => {
  //   const [accountAddress, collateralTicker] = (key as string).split('-');
  //   const item = (items as BridgeVaultData[]).find(
  //     (item) => item.id.accountId.toString() === accountAddress && item.collateralCurrency.ticker === collateralTicker
  //   );
  //   onSelectionChange(item as BridgeVaultData);
  // };

  return (
    <Flex direction='column' flex='1'>
      <Select<BridgeVaultData>
        {...props}
        items={items}
        onSelectionChange={onSelectionChange}
        type='modal'
        modalTitle='Select Token'
        size='large'
      >
        {(data: BridgeVaultData) => {
          const key = getVaultKey(data);

          return (
            <Item key={key} textValue={data.id.accountId.toString()}>
              <ListItem data={data} />
            </Item>
          );
        }}
      </Select>
    </Flex>
  );
};

VaultSelect.displayName = 'VaultSelect';

export { VaultSelect };
export type { VaultSelectProps };
