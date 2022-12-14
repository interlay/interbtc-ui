import clsx from 'clsx';

import WarningBanner from '../WarningBanner';

const TestnetBanner = (): JSX.Element => (
  <WarningBanner className={clsx('mx-auto', 'md:max-w-2xl')} severity='info'>
    <p>
      Thanks for trying out the testnet! The testnet might be reset at any point to make sure we can get the latest
      version of our software to you.
    </p>
  </WarningBanner>
);

export default TestnetBanner;
