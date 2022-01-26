
import clsx from 'clsx';

import Hr1 from 'components/hrs/Hr1';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';

const Title = (): JSX.Element => (
  <div>
    <h3
      className={clsx(
        'font-medium',
        'text-base',
        { 'text-interlayDenim':
          process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
        { 'dark:text-kintsugiOchre': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        'text-center'
      )}>
      Stake KINT
    </h3>
    <Hr1
      className={clsx(
        'border-t-2',
        'my-2'
      )} />
  </div>
);

export default Title;
