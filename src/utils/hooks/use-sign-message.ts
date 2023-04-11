import { PressEvent } from '@react-types/shared';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';

import { TERMS_AND_CONDITIONS_LINK } from '@/config/relay-chains';
import { SIGNER_API_URL } from '@/constants';
import { KeyringPair, useSubstrateSecureState } from '@/lib/substrate';

import { signMessage } from '../helpers/wallet';

const postSignature = async (account: KeyringPair) => {
  const signerResult = await signMessage(account, TERMS_AND_CONDITIONS_LINK);

  if (!signerResult?.signature) {
    throw new Error('Failed to sign message');
  }

  return fetch(`${SIGNER_API_URL}/${account.address}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      signed_message: signerResult?.signature
    })
  });
};

const getSignature = (account: KeyringPair) => {
  return fetch(`${SIGNER_API_URL}/${account.address}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

type UseSignMessageResult = {
  hasSignature?: boolean;
  selectProp: { onSelectionChange: (account: KeyringPair) => void };
  buttonProps: {
    onPress: (e: PressEvent) => void;
  };
};

const useSignMessage = (): UseSignMessageResult => {
  const [hasSigned, setHasSigned] = useState<boolean>(false);
  const { selectedAccount } = useSubstrateSecureState();

  const handleError = (error: Error) => console.log(error);

  const signMessageMutation = useMutation((account: KeyringPair) => postSignature(account), {
    onError: handleError
  });

  useEffect(() => {
    if (!selectedAccount) return;
    console.log('getSignature(account)', getSignature(selectedAccount));

    setHasSigned(false);
  }, [selectedAccount]);

  const handleSignMessage = (account?: KeyringPair) => {
    // should not sign message if there is already a stored signature
    // or if signer api url is not set
    if (!account || !SIGNER_API_URL || hasSigned) return;

    signMessageMutation.mutate(account);
  };

  return {
    hasSignature: !SIGNER_API_URL || hasSigned,
    selectProp: { onSelectionChange: handleSignMessage },
    buttonProps: { onPress: () => handleSignMessage(selectedAccount) }
  };
};

export { useSignMessage };
export type { UseSignMessageResult };
