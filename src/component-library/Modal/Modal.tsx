import { forwardRef, useRef } from 'react';

import { DialogProps } from '../Dialog';
import { Overlay } from '../Overlay';
import { useDOMRef } from '../utils/dom';
import { StyledDialog } from './Modal.style';
import { ModalContext } from './ModalContext';
import { ModalWrapper, ModalWrapperProps } from './ModalWrapper';

const isInteractingWithToasts = (element: Element) => {
  const toastsContainer = document.querySelector('.Toastify');

  if (!toastsContainer) return false;

  return toastsContainer.contains(element);
};

type Props = {
  container?: Element;
  hasMaxHeight?: boolean;
  align?: 'top' | 'center';
};

type InheritAttrs = Omit<ModalWrapperProps & DialogProps, keyof Props | 'size' | 'wrapperRef'>;

type ModalProps = Props & InheritAttrs;

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      children,
      isDismissable = true,
      align = 'center',
      hasMaxHeight,
      isKeyboardDismissDisabled,
      shouldCloseOnBlur,
      shouldCloseOnInteractOutside,
      container,
      ...props
    },
    ref
  ): JSX.Element | null => {
    const domRef = useDOMRef(ref);
    const { isOpen, onClose } = props;
    const wrapperRef = useRef<HTMLDivElement>(null);

    const isCentered = align === 'center';

    // Does not allow the modal to close when clicking on toasts
    const handleShouldCloseOnInteractOutside = (element: Element) =>
      shouldCloseOnInteractOutside
        ? shouldCloseOnInteractOutside?.(element) && !isInteractingWithToasts(element)
        : !isInteractingWithToasts(element);

    return (
      <ModalContext.Provider value={{ bodyProps: { overflow: isCentered ? 'auto' : undefined } }}>
        <Overlay isOpen={isOpen} container={container} nodeRef={wrapperRef}>
          <ModalWrapper
            ref={domRef}
            align={align}
            isDismissable={isDismissable}
            isOpen={isOpen}
            isKeyboardDismissDisabled={isKeyboardDismissDisabled}
            shouldCloseOnBlur={shouldCloseOnBlur}
            shouldCloseOnInteractOutside={handleShouldCloseOnInteractOutside}
            onClose={onClose}
            wrapperRef={wrapperRef}
          >
            <StyledDialog $hasMaxHeight={hasMaxHeight} $isCentered={isCentered} {...props}>
              {children}
            </StyledDialog>
          </ModalWrapper>
        </Overlay>
      </ModalContext.Provider>
    );
  }
);

Modal.displayName = 'Modal';

export { Modal };
export type { ModalProps };
