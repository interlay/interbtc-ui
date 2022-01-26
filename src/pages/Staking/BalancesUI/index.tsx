
import clsx from 'clsx';

import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';

const BalancesUI = (): JSX.Element => {
  return (
    <div
      className={clsx(
        'rounded-xl',
        'p-4',
        // TODO: placeholder color
        { 'bg-interlayPaleSky':
          process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
        // TODO: placeholder color
        { 'dark:bg-kintsugiViolet': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        'grid',
        'grid-cols-2',
        'gap-7'
      )}>
      {/* ray test touch << */}
      <div>
        <span className='block'>
          My KINT Balance
        </span>
        <span className='block'>
          245.535 KINT
        </span>
      </div>
      <div>
        <span className='block'>
          My Staked KINT
        </span>
        <span className='block'>
          26.00 vKINT
        </span>
      </div>
      {/* ray test touch >> */}
    </div>
  );
};

export default BalancesUI;
