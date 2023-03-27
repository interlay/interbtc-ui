import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { showAccountModalAction } from '@/common/actions/general.actions';
import { CTA, CTAProps } from '@/component-library';
import { useSubstrateSecureState } from '@/lib/substrate';
import { useSignMessage } from '@/utils/hooks/use-sign-message';

enum AuthStatus {
  UNAUTH,
  AUTH,
  UNSIGNED
}

const useAuthCTAProps = (props: AuthCTAProps): AuthCTAProps => {
  const { t } = useTranslation();
  const { hasSignature, buttonProps } = useSignMessage();

  const { selectedAccount } = useSubstrateSecureState();

  const status = selectedAccount ? (hasSignature ? AuthStatus.AUTH : AuthStatus.UNSIGNED) : AuthStatus.UNAUTH;

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
