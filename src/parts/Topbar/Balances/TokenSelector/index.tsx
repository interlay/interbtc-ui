import * as React from 'react';
import clsx from 'clsx';

import Select, {
  SelectButton,
  SelectOptions,
  SelectOption,
  SelectBody,
  SelectCheck,
  SelectText
} from 'components/Select';
import { TokenType } from 'common/types/util.types';

interface TokenOption {
  type: TokenType;
  balance: string;
  symbol: string;
  icon: JSX.Element;
}

interface Props {
  tokenOptions: Array<TokenOption>;
  showBalance?: boolean;
  currentToken: TokenOption;
  onChange?: (type: TokenType) => void;
}

const TokenSelector = ({
  tokenOptions,
  currentToken,
  onChange,
  showBalance = true
}: Props): JSX.Element => {
  const handleSelectToken = (selectedToken: TokenType) => {
    console.log('handle select from here', selectedToken);

    if (!onChange) return;

    onChange(selectedToken);
  };

  return (
    <>
      {currentToken && (
        <Select
          key={currentToken.type}
          value={currentToken.type}
          onChange={handleSelectToken}>
          {({ open }) => (
            <>
              <SelectBody
                className={clsx(
                  'w-52'
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
                      {showBalance && (currentToken.balance)} {currentToken.symbol}
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
                                {showBalance && (tokenOption.balance)} {tokenOption.symbol}
                              </SelectText>
                            </div>
                            {selected ? (
                              <SelectCheck
                                active={active} />
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
      )}
    </>
  );
};

export default TokenSelector;
