import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
}

const PORTAL_ROOT_ID = 'portal-root';

const createPortalRootElement = () => {
  const rootElement = document.createElement('div');
  rootElement.setAttribute('id', PORTAL_ROOT_ID);
  document.body.appendChild(rootElement);
  return rootElement;
};

const portalRoot = document.getElementById(PORTAL_ROOT_ID) || createPortalRootElement();

const Portal = ({ children }: PortalProps): JSX.Element | null => {
  const [portalElementNode, setPortalElementNode] = useState<HTMLElement | undefined>(undefined);

  useEffect(() => {
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
