import clsx from 'clsx';
import * as React from 'react';

import CloseIconButton from '@/components/buttons/CloseIconButton';
import { InterlayModalTitle } from '@/components/UI/InterlayModal';

interface AccountContentWrapperProps {
  title: string;
  focusRef: React.MutableRefObject<null>;
  children: React.ReactNode;
  onClose: () => void;
}

const AccountModalContentWrapper = ({
  title,
  focusRef,
  children,
  onClose
}: AccountContentWrapperProps): JSX.Element => (
  <>
    <InterlayModalTitle as='h3' className={clsx('text-lg', 'font-medium', 'mb-6')}>
      {title}
    </InterlayModalTitle>
    <CloseIconButton ref={focusRef} onClick={onClose} />
    <div className='space-y-4'>{children}</div>
  </>
);

export default AccountModalContentWrapper;
