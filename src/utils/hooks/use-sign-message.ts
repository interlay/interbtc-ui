import { PressEvent } from '@react-types/shared';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useLocalStorage } from 'react-use';

import { TERMS_AND_CONDITIONS_LINK } from '@/config/relay-chains';
import { SIGNER_API_URL } from '@/constants';
import { KeyringPair, useSubstrateSecureState } from '@/lib/substrate';

import { signMessage } from '../helpers/wallet';

const postSignature = async (account: KeyringPair) => {
  const signerResult = await signMessage(account, TERMS_AND_CONDITIONS_LINK);

  if (!signerResult?.signature) {
    throw new Error('Failed to sign message');
  }

  return fetch(`${SIGNER_API_URL}/accept`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      accountid: account.address,
      signature: signerResult?.signature
    })
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
  const [account, setAccount] = useState<KeyringPair>();
  // TODO: replace this with new get endpoint
  const [signature, setSignature] = useLocalStorage<string>(`$tc-${account?.address}`);
  const { selectedAccount } = useSubstrateSecureState();

  // TODO: this function might be removed
  const handleSuccess = (account?: KeyringPair) => {
    if (!account) return;
    setSignature(`$tc-${account.address}`);
  };

  const handleError = (error: Error) => console.log(error);

  const signMessageMutation = useMutation((account: KeyringPair) => postSignature(account), {
    onSuccess: () => handleSuccess(account),
    onError: handleError
  });

  useEffect(() => {
    if (!selectedAccount) return;
    setAccount(selectedAccount);
  }, [selectedAccount]);

  const handleSignMessage = (account?: KeyringPair) => {
    // should not sign message if there is already a stored signature
    // or if signer api url is not set
    if (!account || !SIGNER_API_URL || signature) return;

    signMessageMutation.mutate(account);
  };

  return {
    hasSignature: !SIGNER_API_URL || !!signature,
    selectProp: { onSelectionChange: handleSignMessage },
    buttonProps: { onPress: () => handleSignMessage(selectedAccount) }
  };
};

export { useSignMessage };
export type { UseSignMessageResult };
