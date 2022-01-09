import * as React from 'react';
import {
  useSelector
} from 'react-redux';

import TokenSelector from './TokenSelector';
import {
  WRAPPED_TOKEN_SYMBOL,
  WrappedTokenLogoIcon,
  COLLATERAL_TOKEN_SYMBOL,
  CollateralTokenLogoIcon
} from 'config/relay-chains';
import { displayMonetaryAmount } from 'common/utils/utils';
import {
  TokenType,
  StoreType
} from 'common/types/util.types';

interface TokenOption {
  type: TokenType;
  balance: string;
  symbol: string;
  icon: JSX.Element;
}

interface Props {
  callbackFunction?: (token: TokenOption) => void;
}

const Balances = ({ callbackFunction }: Props): JSX.Element => {
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
  }, [tokenOptions, currentToken, getTokenOption]);

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
        type: TokenType.COLLATERAL,
        balance: displayMonetaryAmount(collateralTokenBalance),
        icon: <CollateralTokenLogoIcon
          width={26} />,
        symbol: COLLATERAL_TOKEN_SYMBOL
      },
      {
        type: TokenType.WRAPPED,
        balance: displayMonetaryAmount(wrappedTokenBalance),
        icon: <WrappedTokenLogoIcon
          width={26} />,
        symbol: WRAPPED_TOKEN_SYMBOL
      }
    ];

    setTokenOptions(tokenOptions);
  }, [collateralTokenBalance, wrappedTokenBalance]);

  // If tokenOptions change while a current token is set,
  // reset currentToken to get updated values. This happens
  // when the balance updates after the initial render.
  React.useEffect(() => {
    if (!currentToken) return;

    setCurrentToken(getTokenOption(currentToken.type));
  }, [currentToken, getTokenOption, tokenOptions]);

  return (
    <>
      {tokenOptions && currentToken ?
        <TokenSelector
          tokenOptions={tokenOptions}
          currentToken={currentToken}
          onChange={handleUpdateToken} /> :
        null
      }
    </>
  );
};

export default Balances;
