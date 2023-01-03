import { Modal, ModalBody, ModalHeader, ModalProps } from '../Modal';
import { Span } from '../Text';
import { StyledListHeader } from './TokenInput.style';
import { TokenData, TokenList } from './TokenList';

type Props = {
  tokens: TokenData[];
  onSelectionChange?: (ticker: string) => void;
  selectedToken?: string;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type TokenListModalProps = Props & InheritAttrs;

const TokenListModal = ({ selectedToken, tokens, onSelectionChange, ...props }: TokenListModalProps): JSX.Element => (
  <Modal {...props}>
    <ModalHeader size='lg' weight='medium' color='secondary'>
      Select Token
    </ModalHeader>
    <ModalBody overflow='hidden' noPadding>
      <StyledListHeader justifyContent='space-between'>
        <Span weight='light'>Name</Span>
        <Span weight='light'>Balance</Span>
      </StyledListHeader>
      <TokenList items={tokens} selectedToken={selectedToken} onSelectionChange={onSelectionChange} />
    </ModalBody>
  </Modal>
);

export { TokenListModal };
export type { TokenListModalProps };
