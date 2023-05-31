import { forwardRef, ReactNode, useRef } from 'react';

import { Overlay } from '../Overlay';
import { useDOMRef } from '../utils/dom';
import { PopoverContentWrapper } from './PopoverContentWrapper';
import { usePopoverContext } from './PopoverContext';

type Props = { children?: ReactNode };

type PopoverContentProps = Props;

const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  (props, ref): JSX.Element => {
    const { children, ...otherProps } = props;
    const domRef = useDOMRef(ref);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { state, triggerRef, dialogProps, popoverProps } = usePopoverContext();

    return (
      <Overlay {...otherProps} isOpen={state.isOpen} nodeRef={wrapperRef}>
        <PopoverContentWrapper
          {...props}
          ref={domRef}
          state={state}
          dialogProps={dialogProps}
          popoverProps={popoverProps}
          triggerRef={triggerRef as React.RefObject<Element>}
          wrapperRef={wrapperRef}
        >
          {children}
        </PopoverContentWrapper>
      </Overlay>
    );
  }
);

PopoverContent.displayName = 'PopoverContent';

export { PopoverContent };
export type { PopoverContentProps };
