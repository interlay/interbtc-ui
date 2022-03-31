
import clsx from 'clsx';

import Hr1 from 'components/hrs/Hr1';
import { GOVERNANCE_TOKEN_SYMBOL } from 'config/relay-chains';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';

const TitleWithUnderline = (): JSX.Element => (
  <div>
    <h3
      className={clsx(
        'font-medium',
        'text-base',
        // TODO: placeholder color
        { 'text-interlayDenim': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
        // TODO: placeholder color
        { 'dark:text-kintsugiOchre': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        'text-center'
      )}>
      Stake {GOVERNANCE_TOKEN_SYMBOL}
    </h3>
    <Hr1
      className={clsx(
        'border-t-2',
        'my-2'
      )} />
  </div>
);

export default TitleWithUnderline;
