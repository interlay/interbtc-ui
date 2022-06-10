import {
  CollateralIdLiteral,
  newMonetaryAmount,
  tickerToCurrencyIdLiteral,
  WrappedIdLiteral} from '@interlay/interbtc-api';

import { COLLATERAL_TOKEN, GOVERNANCE_TOKEN, VOTE_GOVERNANCE_TOKEN,WRAPPED_TOKEN } from '@/config/relay-chains';

const COLLATERAL_TOKEN_ID_LITERAL = tickerToCurrencyIdLiteral(COLLATERAL_TOKEN.ticker) as CollateralIdLiteral;

const WRAPPED_TOKEN_ID_LITERAL = tickerToCurrencyIdLiteral(WRAPPED_TOKEN.ticker) as WrappedIdLiteral;

const GOVERNANCE_TOKEN_ID_LITERAL = tickerToCurrencyIdLiteral(GOVERNANCE_TOKEN.ticker) as CollateralIdLiteral;

const ZERO_VOTE_GOVERNANCE_TOKEN_AMOUNT = newMonetaryAmount(0, VOTE_GOVERNANCE_TOKEN, true);
const ZERO_GOVERNANCE_TOKEN_AMOUNT = newMonetaryAmount(0, GOVERNANCE_TOKEN, true);

export {
  COLLATERAL_TOKEN_ID_LITERAL,
  GOVERNANCE_TOKEN_ID_LITERAL,
  WRAPPED_TOKEN_ID_LITERAL,
  ZERO_GOVERNANCE_TOKEN_AMOUNT,
  ZERO_VOTE_GOVERNANCE_TOKEN_AMOUNT};
