import { forwardRef, useState } from 'react';
import { Trans } from 'react-i18next';

import { Modal, ModalBody, TextLink } from '@/component-library';
import { TERMS_AND_CONDITIONS_LINK } from '@/config/relay-chains';

type Steps = 'wallet' | 'account';

const AuthModal = (props, ref): JSX.Element => {
  const [step, setStep] = useState<Steps>('wallet');

  return (
    <Modal>
      <ModalBody>
        <Trans i18nKey='exclude_us_citizens'>
          By proceeding you confirm that you have read and accepted the{' '}
          <TextLink external to={TERMS_AND_CONDITIONS_LINK}>
            terms and conditions
          </TextLink>
          , and represent and warrant that you are not a Resident of the United States or a &quot;U.S. person&quot;
          within the meaning of Rule 902(k) under the United States Securities Act of 1933 (the &quot;Securities
          Act&quot;).
        </Trans>
        <
      </ModalBody>
    </Modal>
  );
};

export { AuthModal };
export type { AuthModalProps };
