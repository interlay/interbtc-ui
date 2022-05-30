import { useQuery, useMutation } from 'react-query';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { AccountId } from '@polkadot/types/interfaces';
import { newVaultId, CollateralCurrency, WrappedCurrency } from '@interlay/interbtc-api';

import ErrorFallback from 'components/ErrorFallback';
import ErrorModal from 'components/ErrorModal';
import InterlayDenimOrKintsugiSupernovaContainedButton, {
  Props as InterlayDenimOrKintsugiMidnightContainedButtonProps
} from 'components/buttons/InterlayDenimOrKintsugiSupernovaContainedButton';
import {
  GOVERNANCE_TOKEN_SYMBOL,
  GovernanceTokenMonetaryAmount,
  COLLATERAL_TOKEN,
  WRAPPED_TOKEN
} from 'config/relay-chains';
import { COLLATERAL_TOKEN_ID_LITERAL, ZERO_GOVERNANCE_TOKEN_AMOUNT } from 'utils/constants/currency';
import { displayMonetaryAmount } from 'common/utils/utils';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';

interface CustomProps {
  // TODO: should remove `undefined` later on when the loading is properly handled
  vaultAccountId: AccountId | undefined;
}

const ClaimRewardsButton = ({
  vaultAccountId,
  ...rest
}: CustomProps & InterlayDenimOrKintsugiMidnightContainedButtonProps): JSX.Element => {
  const { t } = useTranslation();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const {
    isIdle: governanceTokenRewardIdle,
    isLoading: governanceTokenRewardLoading,
    data: governanceTokenReward,
    error: governanceTokenRewardError,
    refetch: governanceTokenRewardRefetch
  } = useQuery<GovernanceTokenMonetaryAmount, Error>(
    [
      GENERIC_FETCHER,
      'vaults',
      'getGovernanceReward',
      vaultAccountId,
      COLLATERAL_TOKEN_ID_LITERAL,
      GOVERNANCE_TOKEN_SYMBOL
    ],
    genericFetcher<GovernanceTokenMonetaryAmount>(),
    {
      enabled: !!bridgeLoaded && !!vaultAccountId
    }
  );
  useErrorHandler(governanceTokenRewardError);

  const claimRewardsMutation = useMutation<void, Error, void>(
    () => {
      if (vaultAccountId === undefined) {
        throw new Error('Something went wrong!');
      }

      const vaultId = newVaultId(
        window.bridge.api,
        vaultAccountId.toString(),
        COLLATERAL_TOKEN as CollateralCurrency,
        WRAPPED_TOKEN as WrappedCurrency
      );

      return window.bridge.rewards.withdrawRewards(vaultId);
    },
    {
      onSuccess: () => {
        governanceTokenRewardRefetch();
      }
    }
  );

  const handleClaimRewards = () => {
    claimRewardsMutation.mutate();
  };

  const initializing = governanceTokenRewardIdle || governanceTokenRewardLoading || !vaultAccountId;
  let governanceTokenAmountLabel;
  if (initializing) {
    governanceTokenAmountLabel = '-';
  } else {
    if (governanceTokenReward === undefined) {
      throw new Error('Something went wrong!');
    }

    governanceTokenAmountLabel = displayMonetaryAmount(governanceTokenReward);
  }

  const buttonDisabled = governanceTokenReward?.lte(ZERO_GOVERNANCE_TOKEN_AMOUNT);

  return (
    <>
      <InterlayDenimOrKintsugiSupernovaContainedButton
        disabled={initializing || buttonDisabled}
        onClick={handleClaimRewards}
        pending={claimRewardsMutation.isLoading}
        {...rest}
      >
        {t('vault.claim_governance_token_rewards', {
          governanceTokenAmount: governanceTokenAmountLabel,
          governanceTokenSymbol: GOVERNANCE_TOKEN_SYMBOL
        })}
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

export default withErrorBoundary(ClaimRewardsButton, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
