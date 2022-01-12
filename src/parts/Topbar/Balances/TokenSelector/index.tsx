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
  variant: string;
  tokenOptions: Array<TokenOption>;
  showBalances: boolean;
  currentToken: TokenOption;
  onChange: (type: TokenType) => void;
}

const TokenSelector = ({
  variant,
  tokenOptions,
  currentToken,
  onChange,
  showBalances
}: Props): JSX.Element => {
  return (
    <>
      {currentToken && (
        <Select
          key={currentToken.type}
          value={currentToken.type}
          onChange={onChange}>
          {({ open }) => (
            <>
              <SelectBody
                className={clsx(
                  variant === 'formField' ? 'w-60' : 'w-52'
                )}>
                <SelectButton>
                  <span
                    className={clsx(
                      'flex',
                      variant === 'formField' ? 'text-xl' : null,
                      'items-center',
                      variant === 'formField' ? null : 'space-x-3'
                    )}>
                    {currentToken.icon}
                    <SelectText>
                      {showBalances && (
                        currentToken.balance
                      )}&nbsp;
                      {currentToken.symbol}
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
                                variant === 'formField' ? 'text-xl' : null,
                                variant === 'formField' ? null : 'space-x-3'
                              )}>
                              {tokenOption.icon}
                              <SelectText selected={selected}>
                                {showBalances && (tokenOption.balance)} {tokenOption.symbol}
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
