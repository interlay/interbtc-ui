import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';

import { TokenType } from 'common/types/util.types';
import Select, {
  SelectButton,
  SelectOptions,
  SelectOption,
  SelectBody,
  SelectCheck,
  SelectText
} from 'components/Select';

interface TokenOption {
  type: TokenType;
  balance: string;
  symbol: string;
  icon: JSX.Element;
}

interface Props {
  tokenOptions: Array<TokenOption>;
}

const BalanceSelector = ({
  tokenOptions
}: Props): JSX.Element => {
  const getTokenOption = useCallback((type: TokenType) =>
    tokenOptions.find(token => token.type === type), [tokenOptions]);

  const [currentToken, setCurrentToken] = useState<TokenOption | undefined>(
    getTokenOption(TokenType.COLLATERAL));

  const handleSelectToken = (selectedToken: TokenType) => {
    setCurrentToken(getTokenOption(selectedToken));
  };

  // This is required to ensure that the displayed balance from the selected
  // token options is kept updated, e.g. if a token is funded or if the initial
  // balance is updated afer the first render.
  useEffect(() => {
    if (!currentToken || !tokenOptions) {
      return;
    }

    const selectedTokenType = currentToken.type;

    setCurrentToken(getTokenOption(selectedTokenType));
  }, [tokenOptions, currentToken, getTokenOption]);

  return (
    <div
      className={clsx(
        'flex',
        'space-x-2'
      )}>

      <Select
        key={currentToken?.balance}
        value={currentToken?.type}
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
                  {currentToken?.icon}
                  <SelectText>
                    {currentToken?.balance} {currentToken?.symbol}
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

    </div>
  );
};

export default BalanceSelector;
