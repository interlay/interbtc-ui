import { Modal, ModalBody, ModalProps, ModalTitle } from '../Modal';
import { CurrencyData, CurrencyList, CurrencyListProps } from './CurrencyList';

type Props = {
  currencies: CurrencyData[];
};

type InheritAttrs = Omit<ModalProps & CurrencyListProps, keyof Props | 'children' | 'items'>;

type CurrencyModalProps = Props & InheritAttrs;

const CurrencyModal = ({ selectedCurrency, currencies, onSelect, ...props }: CurrencyModalProps): JSX.Element => (
  <Modal {...props}>
    <ModalTitle size='lg' weight='medium' color='secondary'>
      Select Token
    </ModalTitle>
    <ModalBody>
      {/* <Flex justifyContent='space-between'>
        <Span weight='light'>Name</Span>
        <Span weight='light'>Balance</Span>
      </Flex> */}
      <CurrencyList items={currencies} selectedCurrency={selectedCurrency} onSelect={onSelect} />
    </ModalBody>
  </Modal>
);

export { CurrencyModal };
export type { CurrencyModalProps };
