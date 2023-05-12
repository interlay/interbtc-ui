import { Overlay } from '@react-aria/overlays';
import { mergeProps } from '@react-aria/utils';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Id as NotificationId, toast, ToastOptions } from 'react-toastify';

import { addNotification } from '@/common/actions/general.actions';
import { Notification, StoreType } from '@/common/types/util.types';
import { ToastContainer, TransactionToast, TransactionToastProps } from '@/components';

import { useWallet } from '../hooks/use-wallet';

enum NotificationToast {
  TRANSACTION
}

type NotificationToastAction = { type: NotificationToast.TRANSACTION; props: TransactionToastProps };

const toastComponentMap = { [NotificationToast.TRANSACTION]: TransactionToast };

type ToastMap = Record<number | string, NotificationId | null | undefined>;

type NotifcationInfo = {
  // NotificationId - toast is on the screen
  // null - toast has been dismissed
  // undefined - toast never existed
  id: NotificationId | null | undefined;
  hasRendered: boolean;
  isOnScreen: boolean;
};

type NotificationOptions = ToastOptions;

const toastConfig: NotificationOptions = {
  closeButton: false,
  autoClose: false,
  closeOnClick: false,
  draggable: false,
  icon: false
};

type NotificationsConfig = {
  list: Notification[];
  get: (id: number | string) => NotifcationInfo;
  add: (notification: Omit<Notification, 'date'>) => void;
  show: (id: number | string, action: NotificationToastAction) => void;
  remove: (id: number | string) => void;
};

const defaultContext: NotificationsConfig = {} as NotificationsConfig;

const NotificationsContext = React.createContext(defaultContext);

const useNotifications = (): NotificationsConfig => React.useContext(NotificationsContext);

const NotificationsProvider: React.FC<unknown> = ({ children }) => {
  const toastContainerRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  const { account } = useWallet();
  const { notifications } = useSelector((state: StoreType) => state.general);

  const idsMap = useRef<ToastMap>({});

  // return meta data about the toast
  const get = (id: number | string) => {
    const toastId = idsMap.current[id];

    return {
      id: toastId,
      hasRendered: toastId === null,
      isOnScreen: !!toastId
    };
  };

  // adds the notification to the
  const add = (notification: Omit<Notification, 'date'>) =>
    dispatch(addNotification(account?.toString() as string, { ...notification, date: new Date() }));

  const show = (id: number | string, action: NotificationToastAction) => {
    const toastInfo = get(id);

    const ToastComponent = toastComponentMap[action.type];

    const onDismiss = () => remove(id);

    const render = <ToastComponent {...mergeProps(action.props, { onDismiss })} />;

    if (toastInfo.id) {
      return toast.update(toastInfo.id, { render, ...toastConfig });
    }

    const newToastId = toast(render, toastConfig);
    idsMap.current[id] = newToastId;
  };

  const remove = (id: number | string) => {
    const toasInfo = get(id);

    if (!toasInfo.id) return;

    toast.dismiss(toasInfo.id);
    // Set to null, meaning that this toast should never appear again, even if updated
    idsMap.current[id] = null;
  };

  // Applying data-react-aria-top-layer="true" makes react-aria overlay consider the element as a visible element.
  // Non-visible elements get forced with aria-hidden=true.
  // Check: https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/overlays/src/ariaHideOutside.ts#L32
  useEffect(() => {
    if (!toastContainerRef.current) return;

    toastContainerRef.current.setAttribute('data-react-aria-top-layer', 'true');
  }, [toastContainerRef]);

  return (
    <NotificationsContext.Provider
      value={{
        list: account ? notifications[account.toString()] || [] : [],
        get,
        add,
        show,
        remove
      }}
    >
      {children}
      <Overlay>
        <ToastContainer ref={toastContainerRef} position='top-right' />
      </Overlay>
    </NotificationsContext.Provider>
  );
};

export { NotificationsContext, NotificationsProvider, NotificationToast, useNotifications };
export type { NotificationToastAction };
