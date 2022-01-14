
import * as React from 'react';
import clsx from 'clsx';

import PolkadotJSExtensionAnnotation from 'components/PolkadotJSExtensionAnnotation';
import InterlayModal, {
  Props as ModalProps,
  InterlayModalInnerWrapper,
  InterlayModalTitle
} from 'components/UI/InterlayModal';
import { ReactComponent as PolkadotExtensionLogoIcon } from 'assets/img/polkadot-extension-logo.svg';

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
            'mb-6',
            'flex',
            'items-center',
            'space-x-2'
          )}>
          <PolkadotExtensionLogoIcon
            width={30}
            height={30} />
          <span>
            Pick a wallet
          </span>
        </InterlayModalTitle>
        <PolkadotJSExtensionAnnotation />
      </InterlayModalInnerWrapper>
    </InterlayModal>
  );
};

export type Props = Omit<ModalProps, 'children' | 'onClose'>;

export default PolkadotExtensionModal;
