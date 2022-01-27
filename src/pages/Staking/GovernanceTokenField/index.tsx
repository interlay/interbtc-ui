
// ray test touch <<
import TokenField from 'components/TokenField';
import { GOVERNANCE_TOKEN_SYMBOL } from 'config/relay-chains';

const STAKING_GOVERNANCE_TOKEN_AMOUNT = 'staking-governance-token-amount';

const GovernanceTokenField = (): JSX.Element => {
  return (
    <div>
      <TokenField
        id={STAKING_GOVERNANCE_TOKEN_AMOUNT}
        name={STAKING_GOVERNANCE_TOKEN_AMOUNT}
        label={GOVERNANCE_TOKEN_SYMBOL}
        approxUSD='≈ $ 325.12'
        value='14.00' />
    </div>
  );
};

export default GovernanceTokenField;
// ray test touch >>
