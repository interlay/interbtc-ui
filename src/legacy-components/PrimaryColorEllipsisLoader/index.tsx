import clsx from 'clsx';

import EllipsisLoader from '@/legacy-components/EllipsisLoader';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';

const PrimaryColorEllipsisLoader = (): JSX.Element => (
  <div className={clsx('flex', 'justify-center')}>
    <EllipsisLoader
      dotClassName={clsx(
        { 'bg-interlayDenim': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
        { 'dark:bg-kintsugiOchre': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
      )}
    />
  </div>
);

export default PrimaryColorEllipsisLoader;
