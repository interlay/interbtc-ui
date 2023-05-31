import { Overlay as AriaOverlay } from '@react-aria/overlays';
import { ReactNode, RefObject, useCallback, useState } from 'react';

import { OpenTransition } from './OpenTransition';
import { StyledOverlayWrapper } from './Overlay.style';

type OverlayProps = {
  children: ReactNode;
  nodeRef: RefObject<HTMLElement>;
  isOpen?: boolean;
  container?: Element;
  onEnter?: () => void;
  onEntering?: () => void;
  onEntered?: () => void;
  onExit?: () => void;
  onExiting?: () => void;
  onExited?: () => void;
};

const Overlay = ({
  children,
  nodeRef,
  isOpen,
  container,
  onEnter,
  onEntering,
  onEntered,
  onExit,
  onExiting,
  onExited
}: OverlayProps): JSX.Element | null => {
  const [exited, setExited] = useState(!isOpen);

  const handleEntered = useCallback(() => {
    setExited(false);

    if (onEntered) {
      onEntered();
    }
  }, [onEntered]);

  const handleExited = useCallback(() => {
    setExited(true);

    if (onExited) {
      onExited();
    }
  }, [onExited]);

  // Don't un-render the overlay while it's transitioning out.
  const mountOverlay = isOpen || !exited;
  if (!mountOverlay) {
    // Don't bother showing anything if we don't have to.
    return null;
  }

  return (
    <AriaOverlay portalContainer={container}>
      <StyledOverlayWrapper>
        <OpenTransition
          in={isOpen}
          appear
          onExit={onExit}
          onExiting={onExiting}
          onExited={handleExited}
          onEnter={onEnter}
          onEntering={onEntering}
          onEntered={handleEntered}
          nodeRef={nodeRef}
        >
          {children}
        </OpenTransition>
      </StyledOverlayWrapper>
    </AriaOverlay>
  );
};

export { Overlay };
export type { OverlayProps };
