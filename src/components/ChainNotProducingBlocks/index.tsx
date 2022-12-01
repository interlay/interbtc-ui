import clsx from 'clsx';

import WarningBanner from '@/components/WarningBanner';

const ChainNotProducingBlocks = (): JSX.Element => (
  <WarningBanner className={clsx('mx-auto', 'md:max-w-2xl')} severity='alert'>
    <p>The chain is currently not producing blocks and transactions will fail</p>
  </WarningBanner>
);

export { ChainNotProducingBlocks };
