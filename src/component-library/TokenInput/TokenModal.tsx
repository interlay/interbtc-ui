import { Key } from 'react';

import { Coin } from '../Coin';
import { Flex } from '../Flex';
import { List, ListItem } from '../List';
import { Modal, ModalProps } from '../Modal';
import { H3, Span } from '../Text';
import { StyledListItemLabel } from './TokenInput.style';

type CurrencyItem = {
  currency: string;
  balance: number;
  usd: string;
};

type Props = {
  selectedCurrency: string;
  currencies?: CurrencyItem[];
  onSelectToken?: (currency: string) => void;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type TokenModalProps = Props & InheritAttrs;

const TokenModal = ({ selectedCurrency, currencies = [], onSelectToken, ...props }: TokenModalProps): JSX.Element => {
  return (
    <Modal {...props}>
      <Flex direction='column' gap='spacing3'>
        <H3 size='lg' weight='medium' color='secondary'>
          Select Token
        </H3>
        <Flex justifyContent='space-between'>
          <Span weight='light'>Name</Span>
          <Span weight='light'>Balance</Span>
        </Flex>
        <List
          aria-label='select token'
          selectionMode='multiple'
          selectionBehavior='replace'
          onSelectionChange={(key) => onSelectToken?.([...(key as Set<Key>)][0] as string)}
          selectedKeys={[selectedCurrency]}
        >
          {currencies.map((currency) => {
            const isSelected = selectedCurrency === currency.currency;

            return (
              <ListItem
                key={currency.currency}
                textValue={currency.currency}
                alignItems='center'
                justifyContent='space-between'
                gap='spacing4'
              >
                <Flex alignItems='center' gap='spacing2'>
                  <Coin ticker={currency.currency} />
                  <StyledListItemLabel $isSelected={isSelected}>{currency.currency}</StyledListItemLabel>
                </Flex>
                <Flex direction='column' alignItems='center' gap='spacing2'>
                  <StyledListItemLabel $isSelected={isSelected}>{currency.balance}</StyledListItemLabel>
                  <Span size='s' color='tertiary'>
                    {currency.usd}
                  </Span>
                </Flex>
              </ListItem>
            );
          })}
        </List>
      </Flex>
    </Modal>
  );
};

export { TokenModal };
export type { CurrencyItem, TokenModalProps };
