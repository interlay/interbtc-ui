import * as React from 'react';
import {
  useSelector
} from 'react-redux';

import TokenSelector from './TokenSelector';
import {
  WRAPPED_TOKEN,
  WRAPPED_TOKEN_SYMBOL,
  WrappedTokenLogoIcon,
  COLLATERAL_TOKEN,
  COLLATERAL_TOKEN_SYMBOL,
  CollateralTokenLogoIcon
} from 'config/relay-chains';
import { displayMonetaryAmount } from 'common/utils/utils';
import {
  TokenType,
  StoreType
} from 'common/types/util.types';

const VARIANTS = Object.freeze({
  optionSelector: 'optionSelector',
  formField: 'formField'
});

const BALANCE_VARIANTS = Object.values(VARIANTS);

interface TokenOption {
  token: any;
  type: TokenType;
  balance: string;
  symbol: string;
  icon: JSX.Element;
}

interface Props {
  variant?: typeof BALANCE_VARIANTS[number];
  callbackFunction?: (token: TokenOption) => void;
  showBalances?: boolean;
}

const Balances = ({
  variant = VARIANTS.optionSelector,
  callbackFunction,
  showBalances = true
}: Props): JSX.Element => {
  const [tokenOptions, setTokenOptions] = React.useState<Array<TokenOption> | undefined>(undefined);
  const [currentToken, setCurrentToken] = React.useState<TokenOption | undefined>(undefined);

  const getTokenOption =
    React.useCallback(
      (type: TokenType) => tokenOptions?.find(token => token.type === type),
      [tokenOptions]
    );

  React.useEffect(() => {
    if (!tokenOptions) return;

    if (!currentToken) {
      setCurrentToken(getTokenOption(TokenType.COLLATERAL));
    }

    if (callbackFunction && currentToken) {
      callbackFunction(currentToken);
    }
  }, [tokenOptions, currentToken, getTokenOption, callbackFunction]);

  // TODO (this ticket): Add governance token balance to state.general
  const {
    collateralTokenBalance,
    wrappedTokenBalance
  } = useSelector((state: StoreType) => state.general);

  const handleUpdateToken = (tokenType: TokenType) => {
    const token = getTokenOption(tokenType);
    setCurrentToken(token);

    if (callbackFunction && token) {
      callbackFunction(token);
    }
  };

  React.useEffect(() => {
    const tokenOptions: Array<TokenOption> = [
      {
        token: COLLATERAL_TOKEN,
        type: TokenType.COLLATERAL,
        balance: displayMonetaryAmount(collateralTokenBalance),
        icon:
        <CollateralTokenLogoIcon
          width={variant === 'formField' ? 62 : 26} />,
        symbol: COLLATERAL_TOKEN_SYMBOL
      },
      {
        token: WRAPPED_TOKEN,
        type: TokenType.WRAPPED,
        balance: displayMonetaryAmount(wrappedTokenBalance),
        icon: <WrappedTokenLogoIcon
          width={variant === 'formField' ? 62 : 26} />,
        symbol: WRAPPED_TOKEN_SYMBOL
      }
    ];

    setTokenOptions(tokenOptions);
  },
  [
    collateralTokenBalance,
    wrappedTokenBalance,
    variant
  ]);

  // Reset currentToken to get updated values if tokenOptions change
  // while a current token is set. This will always happen because
  // the token balances update after the initial render.
  React.useEffect(() => {
    if (!currentToken) return;

    setCurrentToken(getTokenOption(currentToken.type));
  }, [currentToken, getTokenOption, tokenOptions]);

  return (
    <>
      {tokenOptions && currentToken ?
        <TokenSelector
          variant={variant}
          showBalances={showBalances}
          tokenOptions={tokenOptions}
          currentToken={currentToken}
          onChange={handleUpdateToken} /> :
        null
      }
    </>
  );
};

export type { TokenOption };
export {
  Balances,
  BALANCE_VARIANTS
};
