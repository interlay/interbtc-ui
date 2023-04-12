import { PressEvent } from '@react-types/shared';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';

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

const getSignature = async (account: KeyringPair | undefined) => {
  if (!account) return;

  return fetch(`${SIGNER_API_URL}/${account.address}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
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
  const [accountHasSigned, setAccountHasSigned] = useState<boolean>(false);

  const { selectedAccount } = useSubstrateSecureState();

  const { data } = useQuery({
    queryKey: `${getSignature}${selectedAccount}`,
    queryFn: () => getSignature(selectedAccount),
    onError: handleError,
    enabled: !!selectedAccount
  });

  const signMessageMutation = useMutation((account: KeyringPair) => postSignature(account), {
    onError: handleError
  });

  const handleSignMessage = (account?: KeyringPair) => {
    // should not sign message if there is already a stored signature
    // or if signer api url is not set
    if (!account || !SIGNER_API_URL || accountHasSigned) return;

    signMessageMutation.mutate(account);
  };

  useEffect(() => {
    if (data?.bodyUsed) return;

    const readData = async () => {
      const response = await data?.json();
      setAccountHasSigned(response?.exists);
    };

    readData();
  }, [data]);

  useEffect(() => {
    console.log('accountHasSigned', accountHasSigned);
  }, [accountHasSigned]);

  return {
    hasSignature: !SIGNER_API_URL || !!accountHasSigned,
    selectProp: { onSelectionChange: handleSignMessage },
    buttonProps: { onPress: () => handleSignMessage(selectedAccount) }
  };
};

export { useSignMessage };
export type { UseSignMessageResult };
