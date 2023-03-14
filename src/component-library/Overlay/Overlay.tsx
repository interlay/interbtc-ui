import { Overlay as AriaOverlay } from '@react-aria/overlays';
import { ReactNode, useCallback, useState } from 'react';

import { OpenTransition } from './OpenTransition';

type OverlayProps = {
  children: ReactNode;
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
      <div>
        <OpenTransition
          in={isOpen}
          appear
          onExit={onExit}
          onExiting={onExiting}
          onExited={handleExited}
          onEnter={onEnter}
          onEntering={onEntering}
          onEntered={handleEntered}
        >
          {children}
        </OpenTransition>
      </div>
    </AriaOverlay>
  );
};

export { Overlay };
export type { OverlayProps };
