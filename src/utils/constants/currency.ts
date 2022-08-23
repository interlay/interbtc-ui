import { newMonetaryAmount } from '@interlay/interbtc-api';

import { GOVERNANCE_TOKEN, VOTE_GOVERNANCE_TOKEN } from '@/config/relay-chains';

const ZERO_VOTE_GOVERNANCE_TOKEN_AMOUNT = newMonetaryAmount(0, VOTE_GOVERNANCE_TOKEN, true);
const ZERO_GOVERNANCE_TOKEN_AMOUNT = newMonetaryAmount(0, GOVERNANCE_TOKEN, true);

export { ZERO_GOVERNANCE_TOKEN_AMOUNT, ZERO_VOTE_GOVERNANCE_TOKEN_AMOUNT };
