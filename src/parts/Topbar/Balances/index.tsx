
import clsx from 'clsx';
import {
  BitcoinAmount,
  MonetaryAmount,
  Currency
} from '@interlay/monetary-js';
import { CollateralUnit } from '@interlay/interbtc-api';

import { displayMonetaryAmount } from 'common/utils/utils';
import { ReactComponent as InterBTCLogoIcon } from 'assets/img/interbtc-logo.svg';
import { ReactComponent as PolkadotLogoIcon } from 'assets/img/polkadot-logo.svg';

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
        <InterBTCLogoIcon
          fill='currentColor'
          width={30}
          height={23.8} />
        <span className='font-medium'>{strWrappedTokenBalance}</span>
        <span className='text-sm'>interBTC</span>
      </div>
      <div
        className={clsx(
          'flex',
          'items-center',
          'space-x-1'
        )}>
        <PolkadotLogoIcon
          width={20}
          height={20} />
        <span className='font-medium'>{strCollateralTokenBalance}</span>
        <span className='text-sm'>DOT</span>
      </div>
    </div>
  );
};

export default Balances;
