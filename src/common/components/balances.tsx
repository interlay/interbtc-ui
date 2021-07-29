
import clsx from 'clsx';
import {
  BTCAmount,
  PolkadotAmount
} from '@interlay/monetary-js';

import { displayMonetaryAmount } from 'common/utils/utils';
import { ReactComponent as InterBTCLogoIcon } from 'assets/img/interbtc-logo.svg';
import { ReactComponent as PolkadotLogoIcon } from 'assets/img/polkadot-logo.svg';

interface Props {
  balanceInterBTC?: BTCAmount;
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
        'flex-wrap',
        'space-x-2',
        'mx-2' // TODO: should use space-x-{number} at upper level
      )}>
      <div
        className={clsx(
          'flex',
          'items-center',
          'space-x-2'
        )}>
        <InterBTCLogoIcon
          fill='currentColor'
          width={30}
          height={30} />
        <span className='font-bold'>{roundedBalanceInterBTC}</span>
        <span>interBTC</span>
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
        <span className='font-bold'>{roundedBalanceDot}</span>
        <span>DOT</span>
      </div>
    </div>
  );
};

export default Balances;
