import { ISubmittableResult } from '@polkadot/types/types';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { updateTransactionModal } from '@/common/actions/general.actions';
import { TransactionModalData } from '@/common/types/util.types';
import { EXTERNAL_PAGES, EXTERNAL_URL_PARAMETERS } from '@/utils/constants/links';
import { NotificationToastAction, NotificationToastType, useNotifications } from '@/context/Notifications';

import { TransactionActions, TransactionStatus } from '../types';
import { getTransactionDescription } from '../utils/description';
import { TransactionResult } from './use-transaction';

type TransactionNotificationsOptions = {
  showSuccessModal?: boolean;
};

type UseTransactionNotificationsResult = {
  onReject: (error?: Error) => void;
  mutationProps: {
    onMutate: (variables: TransactionActions) => void;
    onSigning: (variables: TransactionActions) => void;
    onSuccess: (data: TransactionResult, variables: TransactionActions) => void;
    onError: (error: Error, variables: TransactionActions, context: unknown) => void;
  };
};

// Handles both transactions notifications and modal
const useTransactionNotifications = ({
  showSuccessModal = true
}: TransactionNotificationsOptions): UseTransactionNotificationsResult => {
  const { t } = useTranslation();

  const notifications = useNotifications();

  const dispatch = useDispatch();

  const handleModalOrToast = (
    status: TransactionStatus,
    variables: TransactionActions,
    data?: ISubmittableResult,
    error?: Error
  ) => {
    const toastInfo = notifications.get(variables.timestamp);

    const url =
      data?.txHash &&
      EXTERNAL_PAGES.SUBSCAN.EXTRINSIC.replace(
        `:${EXTERNAL_URL_PARAMETERS.SUBSCAN.BLOCK.HASH}`,
        data.txHash.toString()
      );

    const description = getTransactionDescription(variables, status, t);

    // Add notification to history if status is SUCCESS or ERROR
    if (description && (status === TransactionStatus.SUCCESS || status === TransactionStatus.ERROR)) {
      notifications.add({ description, status, url });
    }

    // If toast already rendered, it means that the user did already dismiss the transaction modal and the toast
    if (toastInfo.hasRendered) return;

    // creating or updating notification
    if (toastInfo.isOnScreen) {
      const toastAction: NotificationToastAction = {
        type: NotificationToastType.TRANSACTION,
        props: {
          variant: status,
          url,
          errorMessage: error?.message,
          description
        }
      };

      return notifications.show(variables.timestamp, toastAction);
    }

    // only reach here if the modal has not been dismissed
    const modalData: TransactionModalData = {
      url,
      description,
      variant: status,
      errorMessage: error?.message,
      timestamp: variables?.timestamp
    };

    const isModalOpen = status === TransactionStatus.SUCCESS ? showSuccessModal : true;

    return dispatch(updateTransactionModal(isModalOpen, modalData));
  };

  const handleSuccess = (result: TransactionResult, variables: TransactionActions) => {
    const status = result.status === 'error' ? TransactionStatus.ERROR : TransactionStatus.SUCCESS;

    handleModalOrToast(status, variables, result.data, result.error);
  };

  return {
    onReject: (error) =>
      dispatch(updateTransactionModal(true, { variant: TransactionStatus.ERROR, errorMessage: error?.message })),
    mutationProps: {
      onMutate: (variables) => handleModalOrToast(TransactionStatus.CONFIRM, variables),
      onSigning: (variables) => handleModalOrToast(TransactionStatus.SUBMITTING, variables),
      onSuccess: (result, variables) => handleSuccess(result, variables),
      onError: (error, variables) => handleModalOrToast(TransactionStatus.ERROR, variables, undefined, error)
    }
  };
};

export { useTransactionNotifications };
