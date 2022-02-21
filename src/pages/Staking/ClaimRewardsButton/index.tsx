
import { useSelector } from 'react-redux';
import {
  useMutation,
  useQueryClient
} from 'react-query';
import clsx from 'clsx';

import ErrorModal from 'components/ErrorModal';
import InterlayDenimOrKintsugiMidnightContainedButton, {
  Props as InterlayDenimOrKintsugiMidnightContainedButtonProps
} from 'components/buttons/InterlayDenimOrKintsugiMidnightContainedButton';
import { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';

const ClaimRewardsButton = ({
  className,
  ...rest
}: InterlayDenimOrKintsugiMidnightContainedButtonProps): JSX.Element => {
  const { address } = useSelector((state: StoreType) => state.general);

  const queryClient = useQueryClient();

  const claimRewardsMutation = useMutation<void, Error, void>(
    () => {
      return window.bridge.interBtcApi.escrow.withdrawRewards();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          GENERIC_FETCHER,
          'interBtcApi',
          'escrow',
          'getRewardEstimate',
          address
        ]);
        console.log('[claimRewardsMutation onSuccess]');
      },
      onError: error => {
        // TODO: should add error handling UX
        console.log('[claimRewardsMutation onError] error => ', error);
      }
    }
  );

  const handleClaimRewards = () => {
    claimRewardsMutation.mutate();
  };

  return (
    <>
      <InterlayDenimOrKintsugiMidnightContainedButton
        className={clsx(
          'w-full',
          'px-6',
          'py-3',
          'text-base',
          'rounded-md',
          className
        )}
        onClick={handleClaimRewards}
        pending={claimRewardsMutation.isLoading}
        {...rest}>
        Claim Rewards
      </InterlayDenimOrKintsugiMidnightContainedButton>
      {claimRewardsMutation.isError && (
        <ErrorModal
          open={claimRewardsMutation.isError}
          onClose={() => {
            claimRewardsMutation.reset();
          }}
          title='Error'
          description={
            claimRewardsMutation.error?.message ||
            ''
          } />
      )}
    </>
  );
};

export default ClaimRewardsButton;
