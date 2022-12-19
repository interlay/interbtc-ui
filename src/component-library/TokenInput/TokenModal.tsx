import { Flex } from '../Flex';
import { List, ListItem } from '../List';
import { Modal, ModalProps } from '../Modal';
import { H3, Span } from '../Text';

type CurrencyItem = {
  currency: string;
  balance: number;
  usd: string;
};

type Props = {
  currencies?: CurrencyItem[];
  onSelectToken?: (currency: string) => void;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type TokenModalProps = Props & InheritAttrs;

const TokenModal = ({ currencies = [], ...props }: TokenModalProps): JSX.Element => (
  <Modal {...props}>
    <H3>Select Token</H3>
    <List>
      {currencies.map((currency, key) => (
        <ListItem key={key}>
          <Span>{currency.currency}</Span>
          <Flex>
            <Span>{currency.balance}</Span>
            <Span>{currency.usd}</Span>
          </Flex>
        </ListItem>
      ))}
    </List>
  </Modal>
);

export { TokenModal };
export type { CurrencyItem, TokenModalProps };
