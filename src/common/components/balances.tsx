
import clsx from 'clsx';

import { safeRoundFiveDecimals } from 'common/utils/utils';
import { ReactComponent as PolkaBTCLogoIcon } from 'assets/img/polkabtc/PolkaBTCLogo.svg';
// TODO: should use SVG
import polkadotLogo from 'assets/img/small-polkadot-logo.png';

interface Props {
  balancePolkaBTC?: string;
  balanceDOT?: string;
}

const Balances = ({
  balancePolkaBTC,
  balanceDOT
}: Props) => {
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
        <PolkaBTCLogoIcon
          width={50}
          height={30} />
        <span className='font-bold'>{balancePolkaBTC || '0'}</span>
        <span>PolkaBTC</span>
      </div>
      <div
        className={clsx(
          'flex',
          'items-center',
          'space-x-1'
        )}>
        <img
          src={polkadotLogo}
          width='20px'
          height='20px'
          alt='polkadot logo' />
        <span className='font-bold'>{roundedBalanceDot ?? '0'}</span>
        <span>DOT</span>
      </div>
    </div>
  );
};

export default Balances;
