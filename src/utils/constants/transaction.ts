
import { newMonetaryAmount } from '@interlay/interbtc-api';

import { GOVERNANCE_TOKEN } from 'config/relay-chains';

// FIXME: account for transaction fees not with a hardcoded value
const TRANSACTION_FEE_AMOUNT = newMonetaryAmount(0.01, GOVERNANCE_TOKEN);

export {
  TRANSACTION_FEE_AMOUNT
};
