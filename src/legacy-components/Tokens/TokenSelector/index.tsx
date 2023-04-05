import clsx from 'clsx';

import { TokenType } from '@/common/types/util.types';
import { formatNumber } from '@/common/utils/utils';
import Select, {
  SELECT_VARIANTS,
  SelectBody,
  SelectButton,
  SelectCheck,
  SelectOption,
  SelectOptions,
  SelectText
} from '@/legacy-components/Select';

interface TokenOption {
  balance: string;
  transferableBalance: string;
  symbol: string;
  icon: JSX.Element;
}

interface Props {
  variant: string;
  tokenOptions: Array<TokenOption>;
  showBalances: boolean;
  currentToken: TokenOption;
  onChange: (type: TokenType) => void;
  fullWidth?: boolean;
}

const TokenSelector = ({
  variant,
  tokenOptions,
  currentToken,
  onChange,
  showBalances,
  fullWidth
}: Props): JSX.Element => {
  return (
    <>
      {currentToken && (
        <Select variant={variant} key={currentToken.symbol} value={currentToken.symbol} onChange={onChange}>
          {({ open }) => (
            <>
              <SelectBody className={clsx(fullWidth ? 'w-full' : 'w-52')}>
                <SelectButton variant={variant}>
                  <span
                    className={clsx('flex', 'items-center', 'space-x-3', {
                      [clsx('text-xl', 'py-2')]: variant === SELECT_VARIANTS.formField
                    })}
                  >
                    {currentToken.icon}
                    <SelectText>
                      {showBalances && (
                        <span>
                          {formatNumber(Number(currentToken.transferableBalance), {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 8
                          })}
                          &nbsp;
                        </span>
                      )}
                      {currentToken.symbol}
                    </SelectText>
                  </span>
                </SelectButton>
                <SelectOptions open={open} variant={variant}>
                  {tokenOptions.map((tokenOption: TokenOption) => {
                    return (
                      <SelectOption key={tokenOption.symbol} value={tokenOption.symbol}>
                        {({ selected, active }) => (
                          <>
                            <div
                              className={clsx('flex', 'items-center', 'space-x-3', {
                                [clsx('text-xl')]: variant === SELECT_VARIANTS.formField
                              })}
                            >
                              {tokenOption.icon}
                              <SelectText selected={selected}>
                                {showBalances &&
                                  formatNumber(Number(tokenOption.transferableBalance), {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 8
                                  })}{' '}
                                {tokenOption.symbol}
                              </SelectText>
                            </div>
                            {selected ? <SelectCheck active={active} /> : null}
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
