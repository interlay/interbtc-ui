import { Trans, useTranslation } from 'react-i18next';

import { CTA, Modal, ModalBody, ModalFooter, ModalHeader, ModalProps, P, TextLink } from '@/component-library';
import { TERMS_AND_CONDITIONS_LINK } from '@/config/relay-chains';
import { useSignMessage } from '@/utils/hooks/use-sign-message';

type InheritAttrs = Omit<ModalProps, 'children'>;

type SignTermsModalProps = InheritAttrs;

const SignTermsModal = ({ onClose, ...props }: SignTermsModalProps): JSX.Element => {
  const { t } = useTranslation();

  const {
    modal: { buttonProps }
  } = useSignMessage();

  return (
    <Modal onClose={onClose} {...props}>
      <ModalHeader align='start'>Please read and sign the Terms and Conditions</ModalHeader>
      <ModalBody>
        <P size='s'>
          <Trans i18nKey='exclude_us_citizens'>
            By proceeding you confirm that you have read and accepted the{' '}
            <TextLink external to={TERMS_AND_CONDITIONS_LINK} underlined>
              terms and conditions
            </TextLink>
            , and represent and warrant that you are not a Resident of the United States or a &quot;U.S. person&quot;
            within the meaning of Rule 902(k) under the United States Securities Act of 1933 (the &quot;Securities
            Act&quot;). {t('account_modal.sign_terms')}
          </Trans>
        </P>
      </ModalBody>
      <ModalFooter>
        <CTA size='large' {...buttonProps}>
          Accept & Sign
        </CTA>
      </ModalFooter>
    </Modal>
  );
};

export { SignTermsModal };
export type { SignTermsModalProps };
