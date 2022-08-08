import clsx from 'clsx';
import { add, format } from 'date-fns';
import { useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import InterlayDenimOrKintsugiSupernovaContainedButton, {
  Props as InterlayDenimOrKintsugiMidnightContainedButtonProps
} from '@/components/buttons/InterlayDenimOrKintsugiSupernovaContainedButton';
import ErrorModal from '@/components/ErrorModal';
import InformationTooltip from '@/components/tooltips/InformationTooltip';
import { BLOCK_TIME } from '@/config/parachain';
import { GOVERNANCE_TOKEN_SYMBOL } from '@/config/relay-chains';
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
  const { address } = useSelector((state: StoreType) => state.general);

  const queryClient = useQueryClient();

  const withdrawMutation = useMutation<void, Error, void>(
    () => {
      return window.bridge.escrow.withdraw();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([GENERIC_FETCHER, 'escrow', 'getStakedBalance', address]);
      }
    }
  );

  const handleUnstake = () => {
    withdrawMutation.mutate();
  };

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
        pending={withdrawMutation.isLoading}
        disabled={disabled}
        {...rest}
      >
        Withdraw Staked {GOVERNANCE_TOKEN_SYMBOL} {renderUnlockDateLabel()}
      </InterlayDenimOrKintsugiSupernovaContainedButton>
      {withdrawMutation.isError && (
        <ErrorModal
          open={withdrawMutation.isError}
          onClose={() => {
            withdrawMutation.reset();
          }}
          title='Error'
          description={withdrawMutation.error?.message || ''}
        />
      )}
    </>
  );
};

export default WithdrawButton;
