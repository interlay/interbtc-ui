import { GovernanceCurrency, WrappedCurrency } from '@interlay/interbtc-api';
import * as React from 'react';
import { withErrorBoundary } from 'react-error-boundary';

import { TokenType } from '@/common/types/util.types';
import ErrorFallback from '@/components/ErrorFallback';
import { SELECT_VARIANTS, SelectVariants } from '@/components/Select';
import {
  GOVERNANCE_TOKEN,
  GOVERNANCE_TOKEN_SYMBOL,
  GovernanceTokenLogoIcon,
  RELAY_CHAIN_NATIVE_TOKEN,
  RELAY_CHAIN_NATIVE_TOKEN_SYMBOL,
  RelayChainNativeToken,
  RelayChainNativeTokenLogoIcon,
  WRAPPED_TOKEN,
  WRAPPED_TOKEN_SYMBOL,
  WrappedTokenLogoIcon
} from '@/config/relay-chains';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';

import TokenSelector from './TokenSelector';

interface TokenOption {
  token: WrappedCurrency | RelayChainNativeToken | GovernanceCurrency;
  type: TokenType;
  balance: string;
  transferableBalance: string;
  symbol: string;
  icon: JSX.Element;
}

interface Props {
  variant?: SelectVariants;
  fullWidth?: boolean;
  label?: string;
  callbackFunction?: (token: TokenOption) => void;
  showBalances?: boolean;
}

const Tokens = ({
  variant = 'optionSelector',
  fullWidth = false,
  label,
  callbackFunction,
  showBalances = true
}: Props): JSX.Element => {
  const [tokenOptions, setTokenOptions] = React.useState<Array<TokenOption> | undefined>(undefined);
  const [currentToken, setCurrentToken] = React.useState<TokenOption | undefined>(undefined);

  const { data: balances } = useGetBalances();

  const getTokenOption = React.useCallback((type: TokenType) => tokenOptions?.find((token) => token.type === type), [
    tokenOptions
  ]);

  React.useEffect(() => {
    if (!tokenOptions) return;

    if (!currentToken) {
      // Set relay-chain native token as default
      setCurrentToken(getTokenOption(TokenType.RelayChainNative));
    }

    if (callbackFunction && currentToken) {
      callbackFunction(currentToken);
    }
  }, [tokenOptions, currentToken, getTokenOption, callbackFunction]);

  const handleUpdateToken = (tokenType: TokenType) => {
    const token = getTokenOption(tokenType);
    setCurrentToken(token);

    if (callbackFunction && token) {
      callbackFunction(token);
    }
  };

  React.useEffect(() => {
    if (!balances) return;

    const tokenOptions: Array<TokenOption> = [
      {
        token: RELAY_CHAIN_NATIVE_TOKEN,
        type: TokenType.RelayChainNative,
        balance: balances[RELAY_CHAIN_NATIVE_TOKEN.ticker].free.toHuman(5),
        transferableBalance: balances[RELAY_CHAIN_NATIVE_TOKEN.ticker].transferable.toHuman(5),
        icon: <RelayChainNativeTokenLogoIcon height={variant === SELECT_VARIANTS.formField ? 46 : 26} />,
        symbol: RELAY_CHAIN_NATIVE_TOKEN_SYMBOL
      },
      {
        token: WRAPPED_TOKEN,
        type: TokenType.Wrapped,
        balance: balances[WRAPPED_TOKEN.ticker].free.toHuman(8),
        transferableBalance: balances[WRAPPED_TOKEN.ticker].transferable.toHuman(8),
        icon: <WrappedTokenLogoIcon height={variant === SELECT_VARIANTS.formField ? 46 : 26} />,
        symbol: WRAPPED_TOKEN_SYMBOL
      },
      {
        token: GOVERNANCE_TOKEN,
        type: TokenType.Governance,
        balance: balances[GOVERNANCE_TOKEN.ticker].free.toHuman(5),
        transferableBalance: balances[GOVERNANCE_TOKEN.ticker].transferable.toHuman(5),
        icon: <GovernanceTokenLogoIcon height={variant === SELECT_VARIANTS.formField ? 46 : 26} />,
        symbol: GOVERNANCE_TOKEN_SYMBOL
      }
    ];

    setTokenOptions(tokenOptions);
  }, [balances, variant]);

  // Reset currentToken to get updated values if tokenOptions change
  // while a current token is set. This will always happen because
  // the token balances update after the initial render.
  React.useEffect(() => {
    if (!currentToken) return;

    setCurrentToken(getTokenOption(currentToken.type));
  }, [currentToken, getTokenOption, tokenOptions]);

  return (
    <>
      {tokenOptions && currentToken ? (
        <TokenSelector
          fullWidth={fullWidth}
          label={label}
          variant={variant}
          showBalances={showBalances}
          tokenOptions={tokenOptions}
          currentToken={currentToken}
          onChange={handleUpdateToken}
        />
      ) : null}
    </>
  );
};

export type { TokenOption };
export default withErrorBoundary(Tokens, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
