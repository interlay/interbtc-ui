import { ReactNode, useEffect, useRef } from 'react';

import { Flex, Modal, ModalBody, ModalFooter, ModalHeader, ModalProps } from '@/component-library';
import { UseTransactionResult } from '@/hooks/transaction/types/hook';
import { isTransactionFormDisabled } from '@/hooks/transaction/utils/form';
import { useForm } from '@/lib/form';
import yup from '@/lib/form/yup.custom';

import { AuthCTA } from '../AuthCTA';
import { TransactionFeeDetails } from '../TransactionFeeDetails';

const NAME = 'fees-token-field';

type Props = {
  title: ReactNode;
  onSubmit: () => void;
  onOpen: () => void;
  transaction: UseTransactionResult<any>;
  children?: ReactNode;
  submitLabel: ReactNode;
};

type InheritAttrs = Omit<ModalProps, keyof Props>;

type ClaimModalProps = Props & InheritAttrs;

const ClaimModal = ({
  isOpen,
  title,
  submitLabel,
  children,
  transaction,
  onSubmit,
  onOpen,
  ...props
}: ClaimModalProps): JSX.Element => {
  const overlappingModalRef = useRef<HTMLDivElement>(null);

  const form = useForm<{ [NAME]?: string }>({
    initialValues: {
      [NAME]: ''
    },
    validationSchema: yup.object().shape({
      [NAME]: yup.string().required()
    }),
    onSubmit,
    onComplete: onOpen
  });

  // Doing this call on mount so that the form becomes dirty
  useEffect(() => {
    if (!isOpen) return;

    form.setFieldValue(NAME, transaction.fee.defaultCurrency.ticker, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const isBtnDisabled = isTransactionFormDisabled(form, transaction.fee);

  return (
    <Modal {...props} isOpen={isOpen} shouldCloseOnInteractOutside={(el) => !overlappingModalRef.current?.contains(el)}>
      <ModalHeader>{title}</ModalHeader>
      {children && <ModalBody>{children}</ModalBody>}
      <ModalFooter>
        <form onSubmit={form.handleSubmit}>
          <Flex direction='column' gap='spacing4'>
            <TransactionFeeDetails
              fee={transaction.fee}
              selectProps={{
                ...form.getSelectFieldProps(NAME),
                modalRef: overlappingModalRef
              }}
            />
            <AuthCTA type='submit' size='large' disabled={isBtnDisabled}>
              {submitLabel}
            </AuthCTA>
          </Flex>
        </form>
      </ModalFooter>
    </Modal>
  );
};

export { ClaimModal };
export type { ClaimModalProps };
