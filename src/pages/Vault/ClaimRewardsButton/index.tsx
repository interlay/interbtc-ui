
import { useTranslation } from 'react-i18next';
import {
  // useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';

import ErrorFallback from 'components/ErrorFallback';
import
InterlayDenimOrKintsugiSupernovaContainedButton
  from 'components/buttons/InterlayDenimOrKintsugiSupernovaContainedButton';
import { GOVERNANCE_TOKEN_SYMBOL } from 'config/relay-chains';

const ClaimRewardsButton = (): JSX.Element => {
  const { t } = useTranslation();

  // ray test touch <
  // const {
  //   data: governanceReward,
  //   error: governanceRewardError
  // } = useQuery<GovernanceTokenMonetaryAmount, Error>(
  //   [
  //     GENERIC_FETCHER,
  //     'vaults',
  //     'getGovernanceReward',
  //     vaultAccountId,
  //     COLLATERAL_TOKEN_ID_LITERAL,
  //     GOVERNANCE_TOKEN_SYMBOL
  //   ],
  //   genericFetcher<GovernanceTokenMonetaryAmount>(),
  //   {
  //     enabled: !!bridgeLoaded
  //   }
  // );
  // useErrorHandler(governanceRewardError);
  // ray test touch >

  return (
    <InterlayDenimOrKintsugiSupernovaContainedButton>
      {t('vault.claim_governance_token_rewards', {
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
