
import InterlayDefaultOutlinedButton from 'components/buttons/InterlayDefaultOutlinedButton';

import { GOVERNANCE_TOKEN_SYMBOL } from 'config/relay-chains';

const GetGovernanceTokenUI = (): JSX.Element => {
  return (
    <InterlayDefaultOutlinedButton className='m-4'>
      Get {GOVERNANCE_TOKEN_SYMBOL}
    </InterlayDefaultOutlinedButton>
  );
};

export default GetGovernanceTokenUI;
