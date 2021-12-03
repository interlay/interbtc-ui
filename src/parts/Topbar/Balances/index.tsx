import { useState } from 'react';
import clsx from 'clsx';
import {
  BitcoinAmount,
  MonetaryAmount,
  Currency
} from '@interlay/monetary-js';
import {
  CollateralUnit,
  CurrencyUnit
} from '@interlay/interbtc-api';

import Select, {
  SelectButton,
  SelectOptions,
  SelectOption,
  SelectBody,
  SelectCheck,
  SelectText
} from 'components/Select';
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

  const getTokenOption = (type: TokenType) => tokenOptions.find(token => token.type === type);

  const [currentToken, setCurrentToken] = useState<TokenOption | undefined>(getTokenOption(TokenType.COLLATERAL));

  const handleSelectToken = (selectedToken: TokenType) => {
    setCurrentToken(getTokenOption(selectedToken));
  };

  return (
    <div
      className={clsx(
        'flex',
        'space-x-2'
      )}>
      {currentToken &&
        <Select
          value={currentToken.type}
          onChange={handleSelectToken}>
          {({ open }) => (
            <>
              <SelectBody
                className={clsx(
                  'w-44'
                )}>
                <SelectButton>
                  <span
                    className={clsx(
                      'flex',
                      'items-center',
                      'space-x-3'
                    )}>
                    {currentToken.icon}
                    <SelectText>
                      {currentToken.balance} {currentToken.symbol}
                    </SelectText>
                  </span>
                </SelectButton>
                <SelectOptions open={open}>
                  {tokenOptions.map((tokenOption: TokenOption) => {
                    return (
                      <SelectOption
                        key={tokenOption.type}
                        value={tokenOption.type}>
                        {({
                          selected,
                          active
                        }) => {
                          console.log(selected);
                          return (
                            <>
                              <div
                                className={clsx(
                                  'flex',
                                  'items-center',
                                  'space-x-3'
                                )}>
                                {tokenOption.icon}
                                <SelectText selected={selected}>
                                  {tokenOption.balance} {tokenOption.symbol}
                                </SelectText>
                              </div>
                              {selected ? (
                                <SelectCheck
                                  active={active} />
                              ) : null}
                            </>
                          );
                        }}
                      </SelectOption>
                    );
                  })}
                </SelectOptions>
              </SelectBody>
            </>
          )}
        </Select>
      }
    </div>
  );
};

export default Balances;
