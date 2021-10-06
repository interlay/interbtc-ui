
import clsx from 'clsx';
import {
  BitcoinAmount,
  MonetaryAmount,
  Currency
} from '@interlay/monetary-js';
import { CollateralUnit } from '@interlay/interbtc-api';

import {
  WRAPPED_TOKEN_SYMBOL,
  WrappedTokenLogoIcon,
  COLLATERAL_TOKEN_SYMBOL,
  CollateralTokenLogoIcon
} from 'config/relay-chains';
import { displayMonetaryAmount } from 'common/utils/utils';

interface Props {
  wrappedTokenBalance?: BitcoinAmount;
  collateralTokenBalance?: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>;
}

const Balances = ({
  wrappedTokenBalance,
  collateralTokenBalance
}: Props): JSX.Element => {
  const strCollateralTokenBalance = displayMonetaryAmount(collateralTokenBalance);
  const strWrappedTokenBalance = displayMonetaryAmount(wrappedTokenBalance);

  return (
    <div
      className={clsx(
        'flex',
        'space-x-2'
      )}>
      <div
        className={clsx(
          'flex',
          'items-center',
          'space-x-1'
        )}>
        <WrappedTokenLogoIcon
          fill='currentColor'
          width={30} />
        <span className='font-medium'>{strWrappedTokenBalance}</span>
        <span className='text-sm'>{WRAPPED_TOKEN_SYMBOL}</span>
      </div>
      <div
        className={clsx(
          'flex',
          'items-center',
          'space-x-1'
        )}>
        <CollateralTokenLogoIcon width={20} />
        <span className='font-medium'>{strCollateralTokenBalance}</span>
        <span className='text-sm'>{COLLATERAL_TOKEN_SYMBOL}</span>
      </div>
    </div>
  );
};

export default Balances;
