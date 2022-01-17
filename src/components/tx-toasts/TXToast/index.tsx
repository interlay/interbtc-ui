
import * as React from 'react';
import { Toast } from 'react-hot-toast/dist/core/types';
import format from 'date-fns/format';
import clsx from 'clsx';

import InterlayToast from 'components/UI/InterlayToast';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import { ReactComponent as TimerIcon } from 'assets/img/icons/timer.svg';

interface Props {
  t: Toast;
  message: React.ReactNode;
  icon: React.ReactNode;
  startTime: Date | null;
  count: number;
  className?: string;
}

const TXToast = ({
  t,
  message,
  icon,
  startTime,
  count,
  className
}: Props): JSX.Element => {
  const startTimeLabel = startTime ? format(startTime, 'p') : '';

  return (
    <InterlayToast
      t={t}
      className={clsx(
        'space-x-2.5',
        className
      )}
      style={{ minWidth: 298 }}>
      {icon}
      <div className='flex-grow'>
        <p
          className={clsx(
            'text-sm',
            'font-medium'
          )}>
          {message}
        </p>
        <p
          className={clsx(
            'flex',
            'items-center',
            'space-x-1',
            { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
            'font-medium',
            'text-xs'
          )}>
          <span>{startTimeLabel} fm</span>
          <TimerIcon
            width={14}
            height={17} />
          <span>{count} sec</span>
        </p>
      </div>
    </InterlayToast>
  );
};

export default TXToast;
