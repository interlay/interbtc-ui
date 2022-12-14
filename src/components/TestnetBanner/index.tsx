import clsx from 'clsx';

import { BitcoinNetwork } from '@/types/bitcoin';

import WarningBanner from '../WarningBanner';

const TestnetBanner = (): JSX.Element => {
  return (
    <>
      {process.env.REACT_APP_BITCOIN_NETWORK === BitcoinNetwork.Testnet && (
        <WarningBanner className={clsx('mx-auto', 'md:max-w-2xl')} severity='info'>
          <p>
            Thanks for trying out the testnet! The testnet might be reset at any point to make sure we can get the
            latest version of our software to you.
          </p>
        </WarningBanner>
      )}
    </>
  );
};

export default TestnetBanner;
