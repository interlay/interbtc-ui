import { PressEvent } from '@react-types/shared';
import { useMutation, useQuery, UseQueryResult } from 'react-query';

import { TERMS_AND_CONDITIONS_LINK } from '@/config/relay-chains';
import { SIGNER_API_URL } from '@/constants';
import { KeyringPair, useSubstrateSecureState } from '@/lib/substrate';

import { signMessage } from '../helpers/wallet';

interface GetSignatureData {
  exists: boolean;
}

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

const getSignature = (account: KeyringPair | undefined) => {
  if (!account) return;

  return fetch(`${SIGNER_API_URL}/${account.address}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((response) => response.json());
};

const handleError = (error: Error) => console.log(error);

type UseSignMessageResult = {
  hasSignature?: boolean;
  selectProp: { onSelectionChange: (account: KeyringPair) => void };
  buttonProps: {
    onPress: (e: PressEvent) => void;
  };
};

const useSignMessage = (): UseSignMessageResult => {
  const { selectedAccount } = useSubstrateSecureState();
  const requireSigning = !!selectedAccount && !!SIGNER_API_URL;

  const { data: signatureData, refetch: refetchSignatureData }: UseQueryResult<GetSignatureData, Error> = useQuery({
    queryKey: ['getSignature', selectedAccount?.address],
    queryFn: () => getSignature(selectedAccount),
    onError: handleError,
    enabled: requireSigning
  });

  const signMessageMutation = useMutation((account: KeyringPair) => postSignature(account), {
    onError: handleError,
    onSuccess: () => refetchSignatureData()
  });

  const handleSignMessage = (account?: KeyringPair) => {
    // should not sign message if there is already a stored signature
    // or if signer api url is not set
    if (!account || !SIGNER_API_URL || signatureData?.exists) return;

    signMessageMutation.mutate(account);
  };

  return {
    hasSignature: !requireSigning || signatureData?.exists,
    selectProp: { onSelectionChange: handleSignMessage },
    buttonProps: { onPress: () => handleSignMessage(selectedAccount) }
  };
};

export { useSignMessage };
export type { UseSignMessageResult };
