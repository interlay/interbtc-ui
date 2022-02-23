
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
import InterlayTooltip from 'components/UI/InterlayTooltip';
import { GOVERNANCE_TOKEN_SYMBOL } from 'config/relay-chains';
import { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';
import { ReactComponent as InformationCircleIcon } from 'assets/img/hero-icons/information-circle.svg';

interface CustomProps {
  stakedAmount: string;
}

const UnstakeButton = ({
  className,
  stakedAmount,
  ...rest
}: CustomProps & InterlayDenimOrKintsugiMidnightContainedButtonProps): JSX.Element => {
  const { address } = useSelector((state: StoreType) => state.general);

  const queryClient = useQueryClient();

  const unstakeMutation = useMutation<void, Error, void>(
    () => {
      return window.bridge.interBtcApi.escrow.withdraw();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          GENERIC_FETCHER,
          'interBtcApi',
          'escrow',
          'votingBalance',
          address
        ]);
        console.log('[unstakeMutation onSuccess]');
      },
      onError: error => {
        // TODO: should add error handling UX
        console.log('[unstakeMutation onError] error => ', error);
      }
    }
  );

  const handleUnstake = () => {
    unstakeMutation.mutate();
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
        endIcon={
          <InterlayTooltip
            // eslint-disable-next-line max-len
            label={`You can unlock your staked ${stakedAmount} ${GOVERNANCE_TOKEN_SYMBOL} on Dec 24, 2022 at 8:34:45 (hardcoded)`}>
            <InformationCircleIcon
              onClick={event => {
                event.stopPropagation();
              }}
              className={clsx(
                'pointer-events-auto',
                'w-5',
                'h-5'
              )} />
          </InterlayTooltip>
        }
        onClick={handleUnstake}
        pending={unstakeMutation.isLoading}
        {...rest}>
        Unstake Locked {GOVERNANCE_TOKEN_SYMBOL} 24/12/2022 (hardcoded)
      </InterlayDenimOrKintsugiMidnightContainedButton>
      {unstakeMutation.isError && (
        <ErrorModal
          open={unstakeMutation.isError}
          onClose={() => {
            unstakeMutation.reset();
          }}
          title='Error'
          description={
            unstakeMutation.error?.message ||
            ''
          } />
      )}
    </>
  );
};

export default UnstakeButton;
