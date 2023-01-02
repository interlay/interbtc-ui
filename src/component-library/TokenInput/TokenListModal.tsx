import { FocusScope } from '@react-aria/focus';

import { Modal, ModalBody, ModalHeader, ModalProps } from '../Modal';
import { Span } from '../Text';
import { StyledListHeader } from './TokenInput.style';
import { TokenData, TokenList, TokenListProps } from './TokenList';

type Props = {
  tokens: TokenData[];
};

type InheritAttrs = Omit<ModalProps & TokenListProps, keyof Props | 'children' | 'items'>;

type TokenListModalProps = Props & InheritAttrs;

const TokenListModal = ({ selectedToken, tokens, onSelect, ...props }: TokenListModalProps): JSX.Element => (
  <Modal {...props}>
    <ModalHeader size='lg' weight='medium' color='secondary'>
      Select Token
    </ModalHeader>
    <ModalBody overflow='hidden' noPadding>
      <StyledListHeader justifyContent='space-between'>
        <Span weight='light'>Name</Span>
        <Span weight='light'>Balance</Span>
      </StyledListHeader>
      <FocusScope autoFocus>
        <TokenList items={tokens} selectedToken={selectedToken} onSelect={onSelect} />
      </FocusScope>
    </ModalBody>
  </Modal>
);

export { TokenListModal };
export type { TokenListModalProps };
