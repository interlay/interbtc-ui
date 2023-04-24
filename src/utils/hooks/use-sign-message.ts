import { PressEvent } from '@react-types/shared';
import { useCallback } from 'react';
import { useMutation, useQuery, UseQueryResult } from 'react-query';
import { useDispatch } from 'react-redux';

import { showSignTermsModalAction } from '@/common/actions/general.actions';
import { TERMS_AND_CONDITIONS_LINK } from '@/config/relay-chains';
import { SIGNER_API_URL } from '@/constants';
import { KeyringPair, useSubstrateSecureState } from '@/lib/substrate';

import { signMessage } from '../helpers/wallet';
import { LocalStorageKey, TCSignaturesData, useLocalStorage } from './use-local-storage';

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

type UseSignMessageResult = {
  hasSignature?: boolean;
  buttonProps: {
    onPress: (e: PressEvent) => void;
  };
  selectProps: { onSelectionChange: (account: KeyringPair) => void };
  modal: {
    buttonProps: {
      onPress: (e: PressEvent) => void;
      loading: boolean;
    };
  };
};

const useSignMessage = (): UseSignMessageResult => {
  const dispatch = useDispatch();
  const [signatures, setSignatures] = useLocalStorage<TCSignaturesData>(LocalStorageKey.TC_SIGNATURES);
  const { selectedAccount } = useSubstrateSecureState();

  const setSignature = useCallback(
    (address: string, hasSignature: boolean) => setSignatures({ ...signatures, [address]: hasSignature }),
    [setSignatures, signatures]
  );

  const getSignature = useCallback(
    async (account: KeyringPair | undefined): Promise<boolean> => {
      if (!account) {
        return false;
      }

      if (signatures?.[account.address]) {
        return true;
      }

      const res = await fetch(`${SIGNER_API_URL}/${account.address}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response: GetSignatureData = await res.json();

      setSignature(account.address, response.exists);

      return response.exists;
    },
    [setSignature, signatures]
  );

  const { data: hasSignature, refetch: refetchSignatureData }: UseQueryResult<boolean, Error> = useQuery({
    queryKey: ['hasSignature', selectedAccount?.address],
    queryFn: () => getSignature(selectedAccount),
    enabled: !!selectedAccount && !!SIGNER_API_URL
  });

  const signMessageMutation = useMutation((account: KeyringPair) => postSignature(account), {
    onError: (_, variables) => setSignature(variables.address, false),
    onSuccess: (_, variables) => {
      setSignature(variables.address, true);
      dispatch(showSignTermsModalAction(false));
      refetchSignatureData();
    }
  });

  const handleSignMessage = (account?: KeyringPair) => {
    // should not sign message if there is already a stored signature
    // or if signer api url is not set
    if (!account || !SIGNER_API_URL || hasSignature) return;

    signMessageMutation.mutate(account);
  };

  const handleOpenSignTermModal = async (account: KeyringPair) => {
    const hasSignature = await getSignature(account);

    if (hasSignature) return;

    dispatch(showSignTermsModalAction(true));
  };

  return {
    hasSignature: !!hasSignature,
    modal: {
      buttonProps: { onPress: () => handleSignMessage(selectedAccount), loading: signMessageMutation.isLoading }
    },
    selectProps: { onSelectionChange: handleOpenSignTermModal },
    buttonProps: { onPress: () => dispatch(showSignTermsModalAction(true)) }
  };
};

export { useSignMessage };
export type { UseSignMessageResult };
