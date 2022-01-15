
// ray test touch <<
import * as React from 'react';
import { Toast } from 'react-hot-toast/dist/core/types';
import clsx from 'clsx';

import FarmersOnlyToast from 'components/UI/FarmersOnlyToast';
import { ReactComponent as TimerIcon } from 'assets/img/icons/timer.svg';

interface Props {
  t: Toast;
  message: React.ReactNode;
  icon: React.ReactNode;
  startTime: string; // TODO: double-check
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
  return (
    <FarmersOnlyToast
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
            'text-farmersOnlyTextSecondaryInLightMode',
            'dark:text-farmersOnlyTextSecondaryInDarkMode',
            'font-medium',
            'text-xs'
          )}>
          <span>{startTime} fm</span>
          <TimerIcon
            width={14}
            height={17} />
          <span>{count} sec</span>
        </p>
      </div>
    </FarmersOnlyToast>
  );
};

export default TXToast;
// ray test touch >>
