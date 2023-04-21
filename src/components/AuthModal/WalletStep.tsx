import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { showAccountModalAction } from '@/common/actions/general.actions';
import { CTA, CTAProps } from '@/component-library';
import { useSubstrateSecureState } from '@/lib/substrate';
import { useSignMessage } from '@/utils/hooks/use-sign-message';

type AccountModalProps = CTAProps;

const AccountModal = forwardRef<HTMLButtonElement, AccountModalProps>(
  (props, ref): JSX.Element => {
    return <CTA ref={ref} {...props} {...authProps} />;
  }
);

AccountModal.displayName = 'AccountModal';

export { AccountModal };
export type { AccountModalProps };
