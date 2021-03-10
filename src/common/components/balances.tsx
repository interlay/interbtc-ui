
import { safeRoundFiveDecimals } from 'common/utils/utils';
import polkaBTCLogo from 'assets/img/polkabtc/PolkaBTC_black.svg';
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
    <div>
      <span className='btc-balance-wrapper'>
        <span className=''>
          <img
            src={polkaBTCLogo}
            width='50px'
            height='30px'
            alt='polka bitcoin logo'
            className='mr-1' />
          <b>{balancePolkaBTC || '0'}</b>
        </span>{' '}
        PolkaBTC
      </span>
      <span className='dot-balance-wrapper'>
        <img
          src={polkadotLogo}
          width='20px'
          height='20px'
          alt='polkadot logo'
          className='mr-1' />
        <span className=''>
          <b>{roundedBalanceDot ?? '0'}</b>
        </span>{' '}
        DOT
      </span>
    </div>
  );
};

export default Balances;
