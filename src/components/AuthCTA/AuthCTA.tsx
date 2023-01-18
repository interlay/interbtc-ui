import { mergeProps } from '@react-aria/utils';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { showAccountModalAction } from '@/common/actions/general.actions';
import { CTA, CTAProps } from '@/component-library';
import { useSubstrateSecureState } from '@/lib/substrate';

type AuthCTAProps = CTAProps;

const AuthCTA = forwardRef<HTMLButtonElement, AuthCTAProps>(
  ({ onPress, children, type: typeProp, disabled, ...props }, ref): JSX.Element => {
    const { t } = useTranslation();

    const { selectedAccount } = useSubstrateSecureState();
    const dispatch = useDispatch();

    const otherProps = selectedAccount
      ? {
          type: typeProp,
          disabled,
          onPress,
          children
        }
      : {
          type: 'button',
          disabled: false,
          onPress: () => dispatch(showAccountModalAction(true)),
          children: t('connect_wallet')
        };

    return <CTA ref={ref} {...mergeProps(props, otherProps)} />;
  }
);

AuthCTA.displayName = 'AuthCTA';

export { AuthCTA };
export type { AuthCTAProps };
