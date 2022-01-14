
import * as React from 'react';
import clsx from 'clsx';

import PolkadotJSExtensionAnnotation from 'components/PolkadotJSExtensionAnnotation';
import InterlayModal, {
  Props as ModalProps,
  InterlayModalInnerWrapper,
  InterlayModalTitle
} from 'components/UI/InterlayModal';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

const PolkadotExtensionModal = ({
  open
}: Props): JSX.Element => {
  const focusRef = React.useRef(null);

  return (
    <InterlayModal
      initialFocus={focusRef}
      open={open}
      onClose={noop}>
      <InterlayModalInnerWrapper
        className={clsx(
          'p-6',
          'max-w-lg'
        )}>
        <InterlayModalTitle
          as='h3'
          className={clsx(
            'text-lg',
            'font-medium',
            'mb-6'
          )}>
          Pick a wallet
        </InterlayModalTitle>
        <PolkadotJSExtensionAnnotation />
      </InterlayModalInnerWrapper>
    </InterlayModal>
  );
};

export type Props = Omit<ModalProps, 'children' | 'onClose'>;

export default PolkadotExtensionModal;
