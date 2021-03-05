import { ReactElement } from 'react';

import PolkaBitcoin from 'assets/img/PolkaBitcoin-logo.png';
import PolkadotLogo from 'assets/img/small-polkadot-logo.png';
type BalancesProps = {
  balancePolkaBTC?: string;
  balanceDOT?: string;
};

export default function Balances(props: BalancesProps): ReactElement {
  return (
    <div>
      <span className='btc-balance-wrapper'>
        <span className=''>
          <img
            src={PolkaBitcoin}
            width='20px'
            height='20px'
            alt='polka bitcoin logo'
            className='mr-1' />
          <b>{props.balancePolkaBTC || '0'}</b>
        </span>{' '}
        PolkaBTC
      </span>

      <span className='dot-balance-wrapper'>
        <img
          src={PolkadotLogo}
          width='20px'
          height='20px'
          alt='polkadot logo'
          className='mr-1' />
        <span className=''>
          <b>{props.balanceDOT || '0'}</b>
        </span>{' '}
        DOT
      </span>
    </div>
  );
}
