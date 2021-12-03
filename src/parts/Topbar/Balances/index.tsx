import { useState } from 'react';
import clsx from 'clsx';
import {
  BitcoinAmount,
  MonetaryAmount,
  Currency
} from '@interlay/monetary-js';
import { CollateralUnit } from '@interlay/interbtc-api';

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

interface Props {
  wrappedTokenBalance?: BitcoinAmount;
  collateralTokenBalance?: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>;
  // TODO: Add GovernanceUnit type to lib
  governanceTokenBalance?: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>;
}

const Balances = ({
  wrappedTokenBalance,
  collateralTokenBalance,
  governanceTokenBalance
}: Props): JSX.Element => {
  const tokenOptions = [
    {
      type: 'collateral',
      balance: displayMonetaryAmount(collateralTokenBalance),
      icon: <CollateralTokenLogoIcon
        width={26} />,
      symbol: COLLATERAL_TOKEN_SYMBOL
    },
    {
      type: 'wrapped',
      balance: displayMonetaryAmount(wrappedTokenBalance),
      icon: <WrappedTokenLogoIcon
        width={26} />,
      symbol: WRAPPED_TOKEN_SYMBOL
    },
    {
      type: 'governance',
      balance: displayMonetaryAmount(governanceTokenBalance),
      icon: <GovernanceTokenLogoIcon
        width={26} />,
      symbol: GOVERNANCE_TOKEN_SYMBOL
    }
  ];

  const [currentToken, setCurrentToken] = useState<any>(tokenOptions.find(token => token.type === 'collateral'));

  const handleSelectToken = (selectedToken: any) => {
    console.log(selectedToken);
    setCurrentToken(tokenOptions.find(token => token.type === selectedToken));
  };

  return (
    <div
      className={clsx(
        'flex',
        'space-x-2'
      )}>
      <Select
        value={currentToken}
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
                {tokenOptions.map((tokenOption: any) => {
                  return (
                    <SelectOption
                      key={tokenOption.type}
                      value={tokenOption.type}>
                      {({
                        selected,
                        active
                      }) => (
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
                            <SelectCheck active={active} />
                          ) : null}
                        </>
                      )}
                    </SelectOption>
                  );
                })}
              </SelectOptions>
            </SelectBody>
          </>
        )}
      </Select>
    </div>
  );
};

export default Balances;
