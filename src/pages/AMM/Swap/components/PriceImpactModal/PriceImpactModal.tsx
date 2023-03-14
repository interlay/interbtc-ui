import { formatUSD } from '@/common/utils/utils';
import { CTA, Modal, ModalBody, ModalFooter, ModalProps, P } from '@/component-library';
import { SwapPair } from '@/types/swap';

import { StyledModalHeader } from './PriceImpactModal.style';

type Props = {
  onConfirm?: () => void;
  inputValueUSD: number;
  outputValueUSD: number;
  pair: SwapPair;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type PriceImpactModalProps = Props & InheritAttrs;

const PriceImpactModal = ({
  onConfirm,
  onClose,
  inputValueUSD,
  outputValueUSD,
  pair,
  ...props
}: PriceImpactModalProps): JSX.Element => (
  <Modal {...props} onClose={onClose}>
    <StyledModalHeader>Price Impact Warning</StyledModalHeader>
    <ModalBody>
      <P>
        Your are swapping {formatUSD(inputValueUSD, { compact: true })} {pair.input?.ticker} for{' '}
        {formatUSD(outputValueUSD, { compact: true })} {pair.output?.ticker}
      </P>
    </ModalBody>
    <ModalFooter direction='row'>
      <CTA size='large' variant='outlined' fullWidth onPress={onClose}>
        Cancel
      </CTA>
      <CTA size='large' fullWidth onPress={onConfirm}>
        Confirm
      </CTA>
    </ModalFooter>
  </Modal>
);

export { PriceImpactModal };
export type { PriceImpactModalProps };
