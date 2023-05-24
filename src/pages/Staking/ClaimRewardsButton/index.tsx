import clsx from 'clsx';
import { useQueryClient } from 'react-query';

import { GOVERNANCE_TOKEN_SYMBOL } from '@/config/relay-chains';
import InterlayDenimOrKintsugiSupernovaContainedButton, {
  Props as InterlayDenimOrKintsugiMidnightContainedButtonProps
} from '@/legacy-components/buttons/InterlayDenimOrKintsugiSupernovaContainedButton';
import ErrorModal from '@/legacy-components/ErrorModal';
import { useSubstrateSecureState } from '@/lib/substrate';
import { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';
import { Transaction, useTransaction } from '@/utils/hooks/transaction';

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

  const transaction = useTransaction(Transaction.ESCROW_WITHDRAW_REWARDS, {
    onSuccess: () => {
      queryClient.invalidateQueries([GENERIC_FETCHER, 'escrow', 'getRewardEstimate', selectedAccount?.address]);
      queryClient.invalidateQueries([GENERIC_FETCHER, 'escrow', 'getRewards', selectedAccount?.address]);
    }
  });

  const handleClaimRewards = () => {
    transaction.execute();
  };

  return (
    <>
      <InterlayDenimOrKintsugiSupernovaContainedButton
        className={clsx('w-full', 'px-6', 'py-3', 'text-base', 'rounded-md', className)}
        onClick={handleClaimRewards}
        pending={transaction.isLoading}
        {...rest}
      >
        Claim {claimableRewardAmount} {GOVERNANCE_TOKEN_SYMBOL} Rewards
      </InterlayDenimOrKintsugiSupernovaContainedButton>
      {transaction.isError && (
        <ErrorModal
          open={transaction.isError}
          onClose={() => {
            transaction.reset();
          }}
          title='Error'
          description={transaction.error?.message || ''}
        />
      )}
    </>
  );
};

export default ClaimRewardsButton;
