import { mergeProps } from '@react-aria/utils';
import { useEffect, useMemo } from 'react';
import { useState } from 'react';
import { withErrorBoundary } from 'react-error-boundary';
import { useMutation } from 'react-query';

import { Card, Divider, Flex, H1, Input, P, TextLink } from '@/component-library';
import { AuthCTA, MainContainer } from '@/components';
import ErrorFallback from '@/legacy-components/ErrorFallback';
import { useForm } from '@/lib/form';
import { BOB_RECIPIENT_FIELD, BobFormData, bobSchema } from '@/lib/form/schemas';
import { KeyringPair, useSubstrateSecureState } from '@/lib/substrate';

import { NotificationToastType, useNotifications } from '../../utils/context/Notifications';
import { signMessage } from '../../utils/helpers/wallet';
import { StyledWrapper } from './BOB.styles';

const postSignature = async (account: KeyringPair, ethereumAddress: string) => {
  const legalText = await fetch(`https://bob-intr-drop.interlay.workers.dev/legaltext`);

  const message = await legalText.text();

  const signerResult = await signMessage(account, message);

  if (!signerResult?.signature) {
    throw new Error('Failed to sign message');
  }

  return fetch(`https://bob-intr-drop.interlay.workers.dev/accept`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      accountid: account.address,
      signature: signerResult?.signature,
      evmAddress: ethereumAddress
    })
  });
};

const checkAddress = async (address: string) => {
  // This checks if a given address is eligible for claiming
  const response = await fetch(`https://bob-intr-drop.interlay.workers.dev/check/${address}`);

  // If an address is not eligible, error code 499 is returned. We check this here
  // to distinguish address not found from api errors/
  if (!response.ok && response.status !== 499) {
    throw new Error('There was an error checking the address');
  }

  return response.ok;
};

const BOB = (): JSX.Element => {
  const [isEligible, setIsEligible] = useState(false);

  const { selectedAccount } = useSubstrateSecureState();
  const notifications = useNotifications();

  const submitEthereumAddressMutation = useMutation(
    (variables: { selectedAccount: KeyringPair; ethereumAddress: string }) =>
      postSignature(variables.selectedAccount, variables.ethereumAddress),
    {
      onError: async (_, variables) => {
        notifications.show(variables.selectedAccount.address, {
          type: NotificationToastType.STANDARD,
          props: { variant: 'error', title: 'Something went wrong. Please try again.' }
        });
      },
      onSuccess: async (data, variables) => {
        // 409 is a success response to indicate that an EVM address has already been
        // submitted for the signing account so we show the user an error notification.
        data.status === 409
          ? notifications.show(variables.selectedAccount.address, {
              type: NotificationToastType.STANDARD,
              props: {
                variant: 'error',
                title: 'Already submitted',
                description: 'An EVM address has already been submitted for this account.'
              }
            })
          : notifications.show(variables.selectedAccount.address, {
              type: NotificationToastType.STANDARD,
              props: { variant: 'success', title: 'Address submitted' }
            });

        form.resetForm();
      }
    }
  );

  const initialValues = useMemo(
    () => ({
      [BOB_RECIPIENT_FIELD]: ''
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleSubmit = async (values: BobFormData) => {
    const ethereumAddress = values[BOB_RECIPIENT_FIELD];

    if (!selectedAccount || !ethereumAddress) return;

    submitEthereumAddressMutation.mutate({ selectedAccount, ethereumAddress });
  };

  const form = useForm<BobFormData>({
    initialValues,
    validationSchema: bobSchema(),
    onSubmit: handleSubmit
  });

  useEffect(() => {
    if (!selectedAccount?.address) return;

    const setEligibility = async () => {
      const isAddressValid = await checkAddress(selectedAccount.address);

      setIsEligible(isAddressValid);
    };

    setEligibility();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccount?.address]);

  // Reset mutation on account change
  useEffect(() => {
    if (submitEthereumAddressMutation.isLoading && selectedAccount?.address) {
      submitEthereumAddressMutation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccount?.address]);

  return (
    <MainContainer>
      <StyledWrapper direction='column' gap='spacing8'>
        <Card gap='spacing2'>
          <H1 size='base' color='secondary' weight='bold' align='center'>
            BOB x Interlay
          </H1>
          <Divider size='medium' orientation='horizontal' color='secondary' marginBottom='spacing4' />
          <Flex direction='column'>
            {isEligible ? (
              <>
                <Flex direction='column' gap='spacing4'>
                  <P>
                    Claim your{' '}
                    <TextLink external to='http://app.gobob.xyz' underlined>
                      BOB
                    </TextLink>{' '}
                    x Interlay exclusive NFT badge today.
                  </P>
                  <P>
                    Only original Interlay community members are eligible. Simply submit the EVM address you&apos;d like
                    to receive the NFT and sign the transaction with your Interlay account to prove your community
                    status.
                  </P>
                  <P>
                    Submit your Ethereum address below to register. We&apos;ll let you know in Interlay Discord when the NFT
                    is available to claim.
                  </P>
                </Flex>
                <form onSubmit={form.handleSubmit}>
                  <Flex direction='column' gap='spacing8'>
                    <Flex direction='column' gap='spacing4'>
                      <Input
                        placeholder='Enter ethereum address'
                        label='Ethereum Address'
                        padding={{ top: 'spacing5', bottom: 'spacing5' }}
                        {...mergeProps(form.getFieldProps(BOB_RECIPIENT_FIELD, false, true))}
                      />
                    </Flex>
                    <Flex direction='column' gap='spacing4'>
                      <AuthCTA type='submit' size='large'>
                        Register your Ethereum address
                      </AuthCTA>
                    </Flex>
                  </Flex>
                </form>
              </>
            ) : // eslint-disable-next-line no-negated-condition
            !selectedAccount ? (
              <Flex direction='column' gap='spacing4'>
                <P align='center'>Please connect your wallet</P>
              </Flex>
            ) : (
              <Flex direction='column' gap='spacing4'>
                <P align='center'>Sorry, this account is not eligible.</P>
              </Flex>
            )}
          </Flex>
        </Card>
      </StyledWrapper>
    </MainContainer>
  );
};

export default withErrorBoundary(BOB, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
