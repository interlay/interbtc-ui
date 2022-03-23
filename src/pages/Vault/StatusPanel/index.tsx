
import clsx from 'clsx';

import Panel from 'components/Panel';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';

interface Props {
  label: string;
  value: string;
}

const StatusPanel = ({
  label,
  value
}: Props): JSX.Element => {
  return (
    <Panel
      className={clsx(
        'px-4',
        'py-5'
      )}>
      <dt
        className={clsx(
          'text-sm',
          'font-medium',
          'truncate',
          { 'text-interlayTextPrimaryInLightMode':
          process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
          { 'dark:text-kintsugiTextPrimaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
        )}>
        {label}
      </dt>
      <dd
        className={clsx(
          'mt-1',
          'text-3xl',
          'font-semibold',
          { 'text-interlayDenim':
          process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
          { 'dark:text-kintsugiSupernova': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
        )}>
        {value}
      </dd>
    </Panel>
  );
};

export default StatusPanel;
