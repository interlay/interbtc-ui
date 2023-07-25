import { ReactNode } from 'react';

import { SIGNER_API_URL } from '@/constants';
import { useSignMessage } from '@/hooks/use-sign-message';
import { useSubstrateSecureState } from '@/lib/substrate';

type IsAuthenticatedProps = { children: ReactNode };

const IsAuthenticated = ({ children }: IsAuthenticatedProps): JSX.Element | null => {
  const { hasSignature } = useSignMessage();
  const { selectedAccount } = useSubstrateSecureState();

  if (!selectedAccount || (SIGNER_API_URL && !hasSignature)) {
    return null;
  }

  return children as JSX.Element;
};

export { IsAuthenticated };
export type { IsAuthenticatedProps };
