
import clsx from 'clsx';
import {
  BitcoinAmount,
  PolkadotAmount
} from '@interlay/monetary-js';

import { displayMonetaryAmount } from 'common/utils/utils';
import { ReactComponent as InterBTCLogoIcon } from 'assets/img/interbtc-logo.svg';
import { ReactComponent as PolkadotLogoIcon } from 'assets/img/polkadot-logo.svg';

interface Props {
  balanceInterBTC?: BitcoinAmount;
  balanceDOT?: PolkadotAmount;
}

const Balances = ({
  balanceInterBTC,
  balanceDOT
}: Props): JSX.Element => {
  const roundedBalanceDot = displayMonetaryAmount(balanceDOT);
  const roundedBalanceInterBTC = displayMonetaryAmount(balanceInterBTC);

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
        <span className='font-medium'>{roundedBalanceInterBTC}</span>
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
        <span className='font-medium'>{roundedBalanceDot}</span>
        <span className='text-sm'>DOT</span>
      </div>
    </div>
  );
};

export default Balances;
