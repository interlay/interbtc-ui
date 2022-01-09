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
}

const TokenSelector = ({
  tokenOptions
}: Props): JSX.Element => {
  const handleSelectToken = () => {
    console.log('select token');
  };

  return (
    <Select
      key={tokenOptions[0].type}
      value={tokenOptions[0].type}
      onChange={handleSelectToken}>
      {({ open }) => (
        <>
          <SelectBody
            className={clsx(
              'w-34'
            )}>
            <SelectButton
              className={clsx(
                'py-4'
              )}>
              <span
                className={clsx(
                  'flex',
                  'items-center',
                  'space-x-3',
                  'text-2xl',
                  'top-2',
                  'bottom-2'
                )}>
                {tokenOptions[0].icon}
                <SelectText>
                  {tokenOptions[0].symbol}
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
                            {tokenOption.balance} {tokenOption.symbol}
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
  );
};

export default TokenSelector;
