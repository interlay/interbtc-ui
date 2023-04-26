import { PressEvent } from '@react-types/shared';
import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient, UseQueryResult } from 'react-query';
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
    loading: boolean;
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
  const queryClient = useQueryClient();

  const dispatch = useDispatch();
  const [signatures, setSignatures] = useLocalStorage<TCSignaturesData>(LocalStorageKey.TC_SIGNATURES);
  const { selectedAccount } = useSubstrateSecureState();

  const setSignature = useCallback(
    (address: string, hasSignature: boolean) => setSignatures({ ...signatures, [address]: hasSignature }),
    [setSignatures, signatures]
  );

  const getSignature = useCallback(
    async (account: KeyringPair): Promise<boolean> => {
      const storedSignature = signatures?.[account.address];

      if (storedSignature !== undefined) {
        return storedSignature;
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

  const queryKey = ['hasSignature', selectedAccount?.address];

  const {
    data: hasSignature,
    refetch: refetchSignatureData,
    isLoading: isSignatureLoading
  }: UseQueryResult<boolean, Error> = useQuery({
    queryKey,
    refetchOnWindowFocus: false,
    queryFn: () => selectedAccount && getSignature(selectedAccount),
    enabled: !!selectedAccount && !!SIGNER_API_URL,
    onSuccess: (hasSignature) => {
      if (hasSignature) return;
      dispatch(showSignTermsModalAction(true));
    }
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

  const handleOpenSignTermModal = (account: KeyringPair) => {
    queryClient.cancelQueries({ queryKey });
    refetchSignatureData({ queryKey: ['hasSignature', account.address] });
  };

  return {
    hasSignature: !!hasSignature,
    modal: {
      buttonProps: { onPress: () => handleSignMessage(selectedAccount), loading: signMessageMutation.isLoading }
    },
    selectProps: { onSelectionChange: handleOpenSignTermModal },
    buttonProps: { onPress: () => dispatch(showSignTermsModalAction(true)), loading: isSignatureLoading }
  };
};

export { useSignMessage };
export type { UseSignMessageResult };
