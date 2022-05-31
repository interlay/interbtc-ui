import * as React from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
}

const PORTAL_ROOT_ID = 'portal-root';

const Portal = ({ children }: PortalProps): JSX.Element | null => {
  const [portalElementNode, setPortalElementNode] = React.useState<HTMLElement>();

  React.useEffect(() => {
    const createPortalRootElement = () => {
      const rootElement = document.createElement('div');
      rootElement.setAttribute('id', PORTAL_ROOT_ID);
      document.body.appendChild(rootElement);
      return rootElement;
    };

    const portalRoot = document.getElementById(PORTAL_ROOT_ID) || createPortalRootElement();

    const portalElement = document.createElement('div');
    portalRoot.appendChild(portalElement);
    setPortalElementNode(portalElement);

    return () => {
      portalRoot.removeChild(portalElement);
    };
  }, []);

  if (!portalElementNode) {
    return null;
  }

  return createPortal(children, portalElementNode);
};

export default Portal;
