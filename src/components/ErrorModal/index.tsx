
import * as React from 'react';
import clsx from 'clsx';

import IconButton from 'components/IconButton';
import { ReactComponent as CloseIcon } from 'assets/img/icons/close.svg';

import InterlayModal, {
  Props as ModalProps,
  InterlayModalInnerWrapper,
  InterlayModalTitle
} from 'components/UI/InterlayModal';

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
  const closeIconRef = React.useRef(null);

  return (
    <InterlayModal
      initialFocus={closeIconRef}
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
            'font-medium'
          )}>
          {title}
        </InterlayModalTitle>
        <IconButton
          className={clsx(
            'w-12',
            'h-12',
            'absolute',
            'top-3',
            'right-3'
          )}
          onClick={onClose}>
          <CloseIcon
            ref={closeIconRef}
            width={18}
            height={18}
            className='text-textSecondary' />
        </IconButton>
        <p className='text-lg'>
          {description}
        </p>
      </InterlayModalInnerWrapper>
    </InterlayModal>
  );
};

export type Props = Omit<ModalProps, 'children'> & CustomProps;

export default ErrorModal;
