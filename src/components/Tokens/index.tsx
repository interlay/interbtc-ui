
import * as React from 'react';
import {
  useSelector
} from 'react-redux';

import TokenSelector from './TokenSelector';
import {
  SelectVariants,
  SELECT_VARIANTS
} from 'components/Select';

import {
  WrappedToken,
  WRAPPED_TOKEN,
  WRAPPED_TOKEN_SYMBOL,
  WrappedTokenLogoIcon,
  CollateralToken,
  COLLATERAL_TOKEN,
  COLLATERAL_TOKEN_SYMBOL,
  CollateralTokenLogoIcon,
  GovernanceToken,
  GOVERNANCE_TOKEN,
  GOVERNANCE_TOKEN_SYMBOL,
  GovernanceTokenLogoIcon
} from 'config/relay-chains';
import { displayMonetaryAmount } from 'common/utils/utils';
import {
  TokenType,
  StoreType
} from 'common/types/util.types';

interface TokenOption {
  token: WrappedToken | CollateralToken | GovernanceToken;
  type: TokenType;
  balance: string;
  transferableBalance: string;
  symbol: string;
  icon: JSX.Element;
}

interface Props {
  variant?: SelectVariants;
  callbackFunction?: (token: TokenOption) => void;
  showBalances?: boolean;
}

const Tokens = ({
  variant = 'optionSelector',
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
      // Set collateral token as default
      setCurrentToken(getTokenOption(TokenType.COLLATERAL));
    }

    if (callbackFunction && currentToken) {
      callbackFunction(currentToken);
    }
  }, [tokenOptions, currentToken, getTokenOption, callbackFunction]);

  const {
    collateralTokenBalance,
    collateralTokenTransferableBalance,
    wrappedTokenBalance,
    wrappedTokenTransferableBalance,
    governanceTokenBalance,
    governanceTokenTransferableBalance
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
        transferableBalance: displayMonetaryAmount(collateralTokenTransferableBalance),
        icon:
        <CollateralTokenLogoIcon
          height={variant === SELECT_VARIANTS.formField ? 46 : 26} />,
        symbol: COLLATERAL_TOKEN_SYMBOL
      },
      {
        token: WRAPPED_TOKEN,
        type: TokenType.WRAPPED,
        balance: displayMonetaryAmount(wrappedTokenBalance),
        transferableBalance: displayMonetaryAmount(wrappedTokenTransferableBalance),
        icon: <WrappedTokenLogoIcon
          height={variant === SELECT_VARIANTS.formField ? 46 : 26} />,
        symbol: WRAPPED_TOKEN_SYMBOL
      },
      {
        token: GOVERNANCE_TOKEN,
        type: TokenType.GOVERNANCE,
        balance: displayMonetaryAmount(governanceTokenBalance),
        transferableBalance: displayMonetaryAmount(governanceTokenTransferableBalance),
        icon: <GovernanceTokenLogoIcon
          height={variant === SELECT_VARIANTS.formField ? 46 : 26} />,
        symbol: GOVERNANCE_TOKEN_SYMBOL
      }
    ];

    setTokenOptions(tokenOptions);
  },
  [
    collateralTokenBalance,
    collateralTokenTransferableBalance,
    wrappedTokenBalance,
    wrappedTokenTransferableBalance,
    governanceTokenBalance,
    governanceTokenTransferableBalance,
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
export default Tokens;
