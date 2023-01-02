import { forwardRef, MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { showAccountModalAction } from '@/common/actions/general.actions';
import { CTA, CTAProps } from '@/component-library';
import { useSubstrateSecureState } from '@/lib/substrate';

type AuthCTAProps = CTAProps;

const AuthCTA = forwardRef<HTMLButtonElement, AuthCTAProps>(
  ({ onClick, children, type: typeProp, ...props }, ref): JSX.Element => {
    const { t } = useTranslation();

    const { selectedAccount } = useSubstrateSecureState();
    const dispatch = useDispatch();

    // TODO: change to `onPress`
    const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
      if (selectedAccount) {
        onClick?.(e);
      } else {
        dispatch(showAccountModalAction(true));
      }
    };

    return (
      <CTA ref={ref} onClick={handleClick} type={selectedAccount ? typeProp : 'button'} {...props}>
        {selectedAccount ? children : t('connect_wallet')}
      </CTA>
    );
  }
);

AuthCTA.displayName = 'AuthCTA';

export { AuthCTA };
export type { AuthCTAProps };
