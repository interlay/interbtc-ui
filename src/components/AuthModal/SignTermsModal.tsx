import { CTA, Modal, ModalBody, ModalFooter, ModalHeader, ModalProps } from '@/component-library';
import { useSignMessage } from '@/utils/hooks/use-sign-message';

import { Disclaimer } from './Disclaimer';

type InheritAttrs = Omit<ModalProps, 'children'>;

type SignTermsModalProps = InheritAttrs;

const SignTermsModal = ({ onClose, ...props }: SignTermsModalProps): JSX.Element => {
  const {
    modal: { buttonProps }
  } = useSignMessage();

  return (
    <Modal onClose={onClose} {...props}>
      <ModalHeader align='start'>Please read and sign the Terms and Conditions</ModalHeader>
      <ModalBody>
        <Disclaimer showSignTerms />
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
