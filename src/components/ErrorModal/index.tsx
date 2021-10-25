
import * as React from 'react';
import clsx from 'clsx';

import IconButton from 'components/buttons/IconButton';
import InterlayModal, {
  Props as ModalProps,
  InterlayModalInnerWrapper,
  InterlayModalTitle
} from 'components/UI/InterlayModal';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import { ReactComponent as CloseIcon } from 'assets/img/icons/close.svg';

interface CustomProps {
  title: string;
  description: string;
}

const ErrorModal = ({
  open,
  onClose,
  title,
  description
}: Props): JSX.Element => {
  const focusRef = React.useRef(null);

  return (
    <InterlayModal
      initialFocus={focusRef}
      open={open}
      onClose={onClose}>
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
            'mb-4'
          )}>
          {title}
        </InterlayModalTitle>
        <IconButton
          ref={focusRef}
          className={clsx(
            'w-12',
            'h-12',
            'absolute',
            'top-3',
            'right-3'
          )}
          onClick={onClose}>
          <CloseIcon
            width={18}
            height={18}
            className={clsx(
              { 'text-interlaySecondaryInLightMode':
                process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
              { 'dark:text-kintsugiSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
            )} />
        </IconButton>
        <p
          className={clsx(
            'text-base',
            'break-all'
          )}>
          {description}
        </p>
      </InterlayModalInnerWrapper>
    </InterlayModal>
  );
};

export type Props = Omit<ModalProps, 'children'> & CustomProps;

export default ErrorModal;
