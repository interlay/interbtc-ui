
import clsx from 'clsx';

import Select, {
  SelectButton,
  SelectOptions,
  SelectOption,
  SelectBody,
  SelectCheck,
  SelectText,
  SELECT_VARIANTS
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
          variant={variant}
          key={currentToken.type}
          value={currentToken.type}
          onChange={onChange}>
          {({ open }) => (
            <>
              <SelectBody
                className={clsx(
                  'w-52'
                )}>
                <SelectButton variant={variant}>
                  <span
                    className={clsx(
                      'flex',
                      'items-center',
                      'space-x-3',
                      {
                        [clsx(
                          'text-xl',
                          'py-2'
                        )]: variant === SELECT_VARIANTS.formField
                      }
                    )}>
                    {currentToken.icon}
                    <SelectText>
                      {showBalances && (
                        <span>
                          {currentToken.balance}&nbsp;
                        </span>
                      )}
                      {currentToken.symbol}
                    </SelectText>
                  </span>
                </SelectButton>
                <SelectOptions
                  open={open}
                  variant={variant}>
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
                                'space-x-3',
                                {
                                  [clsx(
                                    'text-xl'
                                  )]: variant === SELECT_VARIANTS.formField
                                }
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
