import clsx from 'clsx';
import * as React from 'react';
// ray test touch <
import { Trans } from 'react-i18next';

// ray test touch >
import CloseIconButton from '@/components/buttons/CloseIconButton';
// ray test touch <
import InterlayLink from '@/components/UI/InterlayLink';
// ray test touch >
import { InterlayModalTitle } from '@/components/UI/InterlayModal';
// ray test touch <
import { TERMS_AND_CONDITIONS_LINK } from '@/config/relay-chains';
// ray test touch >

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
    {/* ray test touch < */}
    <p className={clsx('my-4', 'text-sm')}>
      <Trans i18nKey='exclude_us_citizens'>
        By proceeding you confirm that you have read and accepted the{' '}
        <InterlayLink className='underline' target='_blank' rel='noreferrer' href={TERMS_AND_CONDITIONS_LINK}>
          terms and conditions
        </InterlayLink>
        , and represent and warrant that you are not a Resident of the United States or a &quot;U.S. person&quot; within
        the meaning of Rule 902(k) under the United States Securities Act of 1933 (the &quot;Securities Act&quot;).
      </Trans>
    </p>
    {/* ray test touch > */}
    <div className='space-y-4'>{children}</div>
  </>
);

export default AccountModalContentWrapper;
