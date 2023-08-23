import clsx from 'clsx';
import { add, format } from 'date-fns';
import { useQueryClient } from 'react-query';

import { BLOCK_TIME } from '@/config/parachain';
import { GOVERNANCE_TOKEN_SYMBOL } from '@/config/relay-chains';
import { Transaction, useTransaction } from '@/hooks/transaction';
import InterlayDenimOrKintsugiSupernovaContainedButton, {
  Props as InterlayDenimOrKintsugiMidnightContainedButtonProps
} from '@/legacy-components/buttons/InterlayDenimOrKintsugiSupernovaContainedButton';
import InformationTooltip from '@/legacy-components/tooltips/InformationTooltip';
import { useSubstrateSecureState } from '@/lib/substrate';
import { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';
import { YEAR_MONTH_DAY_PATTERN } from '@/utils/constants/date-time';

const getFormattedUnlockDate = (remainingBlockNumbersToUnstake: number, formatPattern: string) => {
  const unlockDate = add(new Date(), {
    seconds: remainingBlockNumbersToUnstake * BLOCK_TIME
  });

  return format(unlockDate, formatPattern);
};

interface CustomProps {
  stakedAmount: string;
  remainingBlockNumbersToUnstake: number | undefined;
}

const WithdrawButton = ({
  className,
  stakedAmount,
  remainingBlockNumbersToUnstake,
  ...rest
}: CustomProps & InterlayDenimOrKintsugiMidnightContainedButtonProps): JSX.Element => {
  const { selectedAccount } = useSubstrateSecureState();

  const transaction = useTransaction(Transaction.ESCROW_WITHDRAW, {
    onSuccess: () => {
      queryClient.invalidateQueries([GENERIC_FETCHER, 'escrow', 'getStakedBalance', selectedAccount?.address]);
    }
  });

  const queryClient = useQueryClient();

  const handleUnstake = () => transaction.execute();

  const disabled = remainingBlockNumbersToUnstake ? remainingBlockNumbersToUnstake > 0 : false;

  const renderUnlockDateLabel = () => {
    return remainingBlockNumbersToUnstake === undefined
      ? '-'
      : getFormattedUnlockDate(remainingBlockNumbersToUnstake, YEAR_MONTH_DAY_PATTERN);
  };

  const renderUnlockDateTimeLabel = () => {
    return remainingBlockNumbersToUnstake === undefined
      ? '-'
      : getFormattedUnlockDate(remainingBlockNumbersToUnstake, 'PPpp');
  };

  return (
    <>
      <InterlayDenimOrKintsugiSupernovaContainedButton
        className={clsx('w-full', 'px-6', 'py-3', 'text-base', 'rounded-md', className)}
        endIcon={
          <InformationTooltip
            // eslint-disable-next-line max-len
            label={`You can unlock your staked ${stakedAmount} ${GOVERNANCE_TOKEN_SYMBOL} on ${renderUnlockDateTimeLabel()}`}
            forDisabledAction={disabled}
          />
        }
        onClick={handleUnstake}
        pending={transaction.isLoading}
        disabled={disabled}
        {...rest}
      >
        Withdraw Staked {GOVERNANCE_TOKEN_SYMBOL} {renderUnlockDateLabel()}
      </InterlayDenimOrKintsugiSupernovaContainedButton>
    </>
  );
};

export default WithdrawButton;
