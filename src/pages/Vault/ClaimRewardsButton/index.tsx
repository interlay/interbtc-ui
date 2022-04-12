
import { useTranslation } from 'react-i18next';

import
InterlayDenimOrKintsugiSupernovaContainedButton
  from 'components/buttons/InterlayDenimOrKintsugiSupernovaContainedButton';
import { GOVERNANCE_TOKEN_SYMBOL } from 'config/relay-chains';

const ClaimRewardsButton = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <InterlayDenimOrKintsugiSupernovaContainedButton>
      {t('vault.claim_governance_token_rewards', {
        governanceTokenSymbol: GOVERNANCE_TOKEN_SYMBOL
      })}
    </InterlayDenimOrKintsugiSupernovaContainedButton>
  );
};

export default ClaimRewardsButton;
