import { ISubmittableResult } from '@polkadot/types/types';
import clsx from 'clsx';
import { useMutation, useQueryClient } from 'react-query';

import { GOVERNANCE_TOKEN_SYMBOL } from '@/config/relay-chains';
import InterlayDenimOrKintsugiSupernovaContainedButton, {
  Props as InterlayDenimOrKintsugiMidnightContainedButtonProps
} from '@/legacy-components/buttons/InterlayDenimOrKintsugiSupernovaContainedButton';
import ErrorModal from '@/legacy-components/ErrorModal';
import { useSubstrateSecureState } from '@/lib/substrate';
import { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';
import { submitExtrinsic } from '@/utils/helpers/extrinsic';

interface CustomProps {
  claimableRewardAmount: string;
}

const ClaimRewardsButton = ({
  className,
  claimableRewardAmount,
  ...rest
}: CustomProps & InterlayDenimOrKintsugiMidnightContainedButtonProps): JSX.Element => {
  const { selectedAccount } = useSubstrateSecureState();

  const queryClient = useQueryClient();

  const claimRewardsMutation = useMutation<ISubmittableResult, Error, void>(
    () => {
      return submitExtrinsic(window.bridge.escrow.withdrawRewards());
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([GENERIC_FETCHER, 'escrow', 'getRewardEstimate', selectedAccount?.address]);
        queryClient.invalidateQueries([GENERIC_FETCHER, 'escrow', 'getRewards', selectedAccount?.address]);
      }
    }
  );

  const handleClaimRewards = () => {
    claimRewardsMutation.mutate();
  };

  return (
    <>
      <InterlayDenimOrKintsugiSupernovaContainedButton
        className={clsx('w-full', 'px-6', 'py-3', 'text-base', 'rounded-md', className)}
        onClick={handleClaimRewards}
        pending={claimRewardsMutation.isLoading}
        {...rest}
      >
        Claim {claimableRewardAmount} {GOVERNANCE_TOKEN_SYMBOL} Rewards
      </InterlayDenimOrKintsugiSupernovaContainedButton>
      {claimRewardsMutation.isError && (
        <ErrorModal
          open={claimRewardsMutation.isError}
          onClose={() => {
            claimRewardsMutation.reset();
          }}
          title='Error'
          description={claimRewardsMutation.error?.message || ''}
        />
      )}
    </>
  );
};

export default ClaimRewardsButton;
