import clsx from 'clsx';

import WarningBanner from '@/legacy-components/WarningBanner';

const ChainErrorBanner = (): JSX.Element => (
  <WarningBanner className={clsx('mx-auto', 'md:max-w-2xl')} severity='alert'>
    <p>The chain is currently not producing blocks and transactions will fail</p>
  </WarningBanner>
);

export { ChainErrorBanner };
