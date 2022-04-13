
import { useQuery } from 'react-query';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { AccountId } from '@polkadot/types/interfaces';

import ErrorFallback from 'components/ErrorFallback';
import
InterlayDenimOrKintsugiSupernovaContainedButton
  from 'components/buttons/InterlayDenimOrKintsugiSupernovaContainedButton';
import {
  GOVERNANCE_TOKEN_SYMBOL,
  GovernanceTokenMonetaryAmount
} from 'config/relay-chains';
import { COLLATERAL_TOKEN_ID_LITERAL } from 'utils/constants/currency';
import { displayMonetaryAmount } from 'common/utils/utils';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';

interface Props {
  // TODO: should remove `undefined` later on when the loading is properly handled
  vaultAccountId: AccountId | undefined;
}

const ClaimRewardsButton = ({
  vaultAccountId
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const {
    isIdle: governanceTokenRewardIdle,
    isLoading: governanceTokenRewardLoading,
    data: governanceTokenReward,
    error: governanceTokenRewardError
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

  const pending = (
    governanceTokenRewardIdle ||
    governanceTokenRewardLoading
  );
  let governanceTokenAmountLabel;
  if (pending) {
    governanceTokenAmountLabel = '-';
  } else {
    if (governanceTokenReward === undefined) {
      throw new Error('Something went wrong!');
    }

    governanceTokenAmountLabel = displayMonetaryAmount(governanceTokenReward);
  }

  return (
    <InterlayDenimOrKintsugiSupernovaContainedButton
      pending={pending}>
      {t('vault.claim_governance_token_rewards', {
        governanceTokenAmount: governanceTokenAmountLabel,
        governanceTokenSymbol: GOVERNANCE_TOKEN_SYMBOL
      })}
    </InterlayDenimOrKintsugiSupernovaContainedButton>
  );
};

export default withErrorBoundary(ClaimRewardsButton, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
