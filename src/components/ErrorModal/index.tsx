import * as React from 'react';
import clsx from 'clsx';

import CloseIconButton from 'components/buttons/CloseIconButton';
import InterlayModal, {
  Props as ModalProps,
  InterlayModalInnerWrapper,
  InterlayModalTitle
} from 'components/UI/InterlayModal';

interface CustomProps {
  title: string;
  description: string;
}

const ErrorModal = ({ open, onClose, title, description }: Props): JSX.Element => {
  const focusRef = React.useRef(null);

  return (
    <InterlayModal initialFocus={focusRef} open={open} onClose={onClose}>
      <InterlayModalInnerWrapper className={clsx('p-6', 'max-w-lg')}>
        <InterlayModalTitle as='h3' className={clsx('text-lg', 'font-medium', 'mb-6')}>
          {title}
        </InterlayModalTitle>
        <CloseIconButton ref={focusRef} onClick={onClose} />
        <p className={clsx('text-base', 'break-all')}>{description}</p>
      </InterlayModalInnerWrapper>
    </InterlayModal>
  );
};

export type Props = Omit<ModalProps, 'children'> & CustomProps;

export default ErrorModal;
