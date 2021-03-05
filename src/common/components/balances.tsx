import { ReactElement } from 'react';

type BalancesProps = {
  balancePolkaBTC?: string;
  balanceDOT?: string;
};

export default function Balances(props: BalancesProps): ReactElement {
  return (
    <div>
      <span className='btc-balance-wrapper'>
        <span className=''>
          <b>{props.balancePolkaBTC || '0'}</b>
        </span>{' '}
        PolkaBTC
      </span>
      <span className='dot-balance-wrapper'>
        <span className=''>
          <b>{props.balanceDOT || '0'}</b>
        </span>{' '}
        DOT
      </span>
    </div>
  );
}
