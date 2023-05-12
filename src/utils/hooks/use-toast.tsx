import { mergeProps } from '@react-aria/utils';
import { useRef } from 'react';
import { Id as ToastId, toast, ToastContent, ToastOptions } from 'react-toastify';

type ToastMap = Record<number | string, ToastId | null | undefined>;

type ToastInfo = {
  id: ToastId | null | undefined;
  hasRendered: boolean;
  isOnScreen: boolean;
};

type UseToastProps = ToastOptions;

type UseToastResult = {
  get: (id: number | string) => ToastInfo;
  add: (id: number | string, content: ToastContent<unknown>, options?: ToastOptions | undefined) => void;
  remove: (id: number | string) => void;
};

const toastConfig: UseToastProps = {
  closeButton: false,
  autoClose: false,
  closeOnClick: false,
  draggable: false,
  icon: false
};

const useToast = (optionsProp: UseToastProps = toastConfig): UseToastResult => {
  const idsMap = useRef<ToastMap>({});

  const get = (id: number | string) => {
    const toastId = idsMap.current[id];

    return {
      id: toastId,
      hasRendered: toastId === null,
      isOnScreen: !!toastId
    };
  };

  const add = (id: number | string, content: ToastContent<unknown>, options?: ToastOptions | undefined) => {
    const toastInfo = get(id);

    const mergedOptions = mergeProps(optionsProp, options || {});

    if (toastInfo.id) {
      return toast.update(toastInfo.id, { render: content, ...mergedOptions });
    }

    const newToastId = toast(content, mergedOptions);
    idsMap.current[id] = newToastId;
  };

  const remove = (id: number | string) => {
    const toasInfo = get(id);

    if (!toasInfo.id) return;

    toast.dismiss(toasInfo.id);
    // Set to null, meaning that this toast should never appear again, even if updated
    idsMap.current[id] = null;
  };

  return {
    get,
    add,
    remove
  };
};

export { useToast };
