import { forwardRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { showAccountModalAction } from '@/common/actions/general.actions';
import { CTA, CTAProps } from '@/component-library';
import { SIGNER_API_URL } from '@/constants';
import { useSignMessage } from '@/hooks/use-sign-message';
import { useSubstrateSecureState } from '@/lib/substrate';
import { useGetParachainStatus } from '@/utils/hooks/api/system/use-get-parachain-status';

enum AuthStatus {
  UNAUTH,
  AUTH,
  UNSIGNED,
  BLOCKED
}

const useAuthCTAProps = (props: AuthCTAProps): AuthCTAProps => {
  const { t } = useTranslation();
  const { hasSignature, buttonProps } = useSignMessage();
  const { data: parachainStatus } = useGetParachainStatus();

  const { selectedAccount } = useSubstrateSecureState();

  const status = useMemo(() => {
    if (!selectedAccount) {
      return AuthStatus.UNAUTH;
    }

    if (!parachainStatus?.isRunning) {
      return AuthStatus.BLOCKED;
    }

    return !SIGNER_API_URL || hasSignature ? AuthStatus.AUTH : AuthStatus.UNSIGNED;
  }, [hasSignature, parachainStatus, selectedAccount]);

  const dispatch = useDispatch();

  const { onPress, children, type: typeProp, disabled } = props;

  switch (status) {
    case AuthStatus.AUTH:
      return {
        type: typeProp,
        disabled,
        onPress,
        children
      };
    case AuthStatus.UNSIGNED:
      return {
        ...buttonProps,
        type: 'button',
        disabled: false,
        children: t('sign_t&cs')
      };
    case AuthStatus.BLOCKED:
      return {
        ...buttonProps,
        type: 'button',
        disabled: true,
        children
      };
    case AuthStatus.UNAUTH:
    default:
      return {
        type: 'button',
        disabled: false,
        onPress: () => dispatch(showAccountModalAction(true)),
        children: t('connect_wallet')
      };
  }
};

type AuthCTAProps = CTAProps;

const AuthCTA = forwardRef<HTMLButtonElement, AuthCTAProps>(
  (props, ref): JSX.Element => {
    const authProps = useAuthCTAProps(props);

    return <CTA ref={ref} {...props} {...authProps} />;
  }
);

AuthCTA.displayName = 'AuthCTA';

export { AuthCTA };
export type { AuthCTAProps };
