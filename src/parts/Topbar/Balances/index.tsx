import { useEffect, useState } from 'react';
import {
  BitcoinAmount,
  MonetaryAmount,
  Currency
} from '@interlay/monetary-js';
import {
  CollateralUnit,
  CurrencyUnit
} from '@interlay/interbtc-api';

import {
  WRAPPED_TOKEN_SYMBOL,
  WrappedTokenLogoIcon,
  COLLATERAL_TOKEN_SYMBOL,
  CollateralTokenLogoIcon,
  GOVERNANCE_TOKEN_SYMBOL,
  GovernanceTokenLogoIcon
} from 'config/relay-chains';
import { displayMonetaryAmount } from 'common/utils/utils';
import { TokenType } from 'common/types/util.types';
import TokenSelector from './TokenSelector';

interface Props {
  wrappedTokenBalance?: BitcoinAmount;
  collateralTokenBalance?: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>;
  // TODO: Add GovernanceUnit type to lib
  governanceTokenBalance?: MonetaryAmount<Currency<CurrencyUnit>, CurrencyUnit>;
}

interface TokenOption {
  type: TokenType;
  balance: string;
  symbol: string;
  icon: JSX.Element;
}

const Balances = ({
  wrappedTokenBalance,
  collateralTokenBalance,
  governanceTokenBalance
}: Props): JSX.Element => {
  const [tokenOptions, setTokenOptions] = useState<Array<TokenOption> | undefined>(undefined);

  useEffect(() => {
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
      },
      {
        type: TokenType.GOVERNANCE,
        balance: displayMonetaryAmount(governanceTokenBalance),
        icon: <GovernanceTokenLogoIcon
          width={26} />,
        symbol: GOVERNANCE_TOKEN_SYMBOL
      }
    ];

    setTokenOptions(tokenOptions);
  }, [collateralTokenBalance, governanceTokenBalance, wrappedTokenBalance]);

  return (
    <>
      {tokenOptions ? <TokenSelector tokenOptions={tokenOptions} /> : null}
    </>
  );
};

export default Balances;
