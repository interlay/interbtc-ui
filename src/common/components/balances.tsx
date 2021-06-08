
import clsx from 'clsx';

import { safeRoundFiveDecimals } from 'common/utils/utils';
import { ReactComponent as PolkabtcLogoIcon } from 'assets/img/polkabtc-logo.svg';
import { ReactComponent as PolkadotLogoIcon } from 'assets/img/polkadot-logo.svg';

interface Props {
  balancePolkaBTC?: string;
  balanceDOT?: string;
}

const Balances = ({
  balancePolkaBTC,
  balanceDOT
}: Props): JSX.Element => {
  const roundedBalanceDot = safeRoundFiveDecimals(balanceDOT);

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
        <PolkabtcLogoIcon
          fill='currentColor'
          width={50}
          height={30} />
        <span className='font-bold'>{balancePolkaBTC || '0'}</span>
        <span>InterBTC</span>
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
        <span className='font-bold'>{roundedBalanceDot ?? '0'}</span>
        <span>DOT</span>
      </div>
    </div>
  );
};

export default Balances;
