
import {
  CollateralIdLiteral,
  WrappedIdLiteral,
  tickerToCurrencyIdLiteral
} from '@interlay/interbtc-api';

import {
  COLLATERAL_TOKEN,
  WRAPPED_TOKEN,
  GOVERNANCE_TOKEN
} from 'config/relay-chains';

const COLLATERAL_TOKEN_ID_LITERAL = tickerToCurrencyIdLiteral(COLLATERAL_TOKEN.ticker) as CollateralIdLiteral;

const WRAPPED_TOKEN_ID_LITERAL = tickerToCurrencyIdLiteral(WRAPPED_TOKEN.ticker) as WrappedIdLiteral;

const GOVERNANCE_TOKEN_ID_LITERAL = tickerToCurrencyIdLiteral(GOVERNANCE_TOKEN.ticker) as CollateralIdLiteral;

export {
  COLLATERAL_TOKEN_ID_LITERAL,
  WRAPPED_TOKEN_ID_LITERAL,
  GOVERNANCE_TOKEN_ID_LITERAL
};
