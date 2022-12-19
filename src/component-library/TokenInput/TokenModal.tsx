import { Modal, ModalProps } from '../Modal';

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

const TokenModal = ({ ...props }: TokenModalProps): JSX.Element => <Modal {...props}>Test</Modal>;

export { TokenModal };
export type { CurrencyItem, TokenModalProps };
