import clsx from 'clsx';

import WarningBanner from '../WarningBanner';

const TestnetBanner = (): JSX.Element => (
  <WarningBanner className={clsx('mx-auto', 'md:max-w-2xl')} severity='alert'>
    <p>
      We are currently facing an issue with block production on the testnet. We are working to restore block production. Until then, the testnet cannot be used. Follow the latest updates in our <a href='https://discord.com/invite/KgCYK3MKSf' target='_blank' rel='noreferrer'>Discord</a>.
    </p>
  </WarningBanner>
);

export default TestnetBanner;
