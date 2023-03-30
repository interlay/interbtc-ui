import { CurrencyExt } from '@interlay/interbtc-api';
import * as React from 'react';
import { withErrorBoundary } from 'react-error-boundary';

import { TokenType } from '@/common/types/util.types';
import { CoinIcon } from '@/component-library';
import { RELAY_CHAIN_NATIVE_TOKEN } from '@/config/relay-chains';
import ErrorFallback from '@/legacy-components/ErrorFallback';
import { SelectVariants } from '@/legacy-components/Select';
import { getCoinIconProps } from '@/utils/helpers/coin-icon';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';

import TokenSelector from './TokenSelector';

interface TokenOption {
  token: CurrencyExt;
  balance: string;
  transferableBalance: string;
  symbol: string;
  icon: JSX.Element;
}

interface Props {
  variant?: SelectVariants;
  callbackFunction?: (token: TokenOption) => void;
  showBalances?: boolean;
  tickers?: Array<string>;
}

const Tokens = ({ variant = 'optionSelector', callbackFunction, showBalances = true, tickers }: Props): JSX.Element => {
  const [tokenOptions, setTokenOptions] = React.useState<Array<TokenOption> | undefined>(undefined);
  const [currentToken, setCurrentToken] = React.useState<TokenOption | undefined>(undefined);

  const { data: balances, getBalance } = useGetBalances();

  const getTokenOption = React.useCallback((ticker) => tokenOptions?.find((token) => token.symbol === ticker), [
    tokenOptions
  ]);

  React.useEffect(() => {
    if (!tokenOptions) return;

    if (!currentToken) {
      // Set relay-chain native token as default
      setCurrentToken(tickers ? getTokenOption(tickers[0]) : getTokenOption(RELAY_CHAIN_NATIVE_TOKEN.ticker));
    }

    if (callbackFunction && currentToken) {
      callbackFunction(currentToken);
    }
  }, [tokenOptions, currentToken, getTokenOption, callbackFunction, tickers]);

  const handleUpdateToken = (tokenType: TokenType) => {
    const token = getTokenOption(tokenType);
    setCurrentToken(token);

    if (callbackFunction && token) {
      callbackFunction(token);
    }
  };

  React.useEffect(() => {
    if (!balances) return;

    const filteredBalances = tickers
      ? Object.values(balances).filter((value) => tickers?.includes(value.currency.ticker))
      : balances;

    const tokenOptions: Array<TokenOption> = Object.values(filteredBalances).map((balance) => ({
      token: balance.currency,
      balance: getBalance(balance.currency.ticker)?.free.toHuman(5) || '0',
      transferableBalance: getBalance(balance.currency.ticker)?.transferable.toHuman(5) || '0',
      icon: <CoinIcon {...getCoinIconProps(balance.currency)} />,
      symbol: balance.currency.ticker
    }));

    setTokenOptions(tokenOptions);
  }, [balances, getBalance, variant, tickers]);

  // Reset currentToken to get updated values if tokenOptions change
  // while a current token is set. This will always happen because
  // the token balances update after the initial render.
  React.useEffect(() => {
    if (!currentToken) return;

    setCurrentToken(getTokenOption(currentToken.symbol));
  }, [currentToken, getTokenOption, tokenOptions]);

  return (
    <>
      {tokenOptions && currentToken ? (
        <TokenSelector
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
