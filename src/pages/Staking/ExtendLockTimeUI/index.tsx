
import * as React from 'react';
import clsx from 'clsx';

import NumberInput from 'components/NumberInput';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';

const EXTENDING_LOCK_TIME = 'extending-lock-time';
const MIN_EXTENDING_LOCK_TIME = 2;
const MAX_EXTENDING_LOCK_TIME = 56;

// MEMO: inspired by https://medium.com/codex/making-html-5-numeric-inputs-only-accept-integers-d3d117973d56
const intRx = /\d/;
const handleExtendingLockTimeChange = (event: KeyboardEvent) => {
  if (
    (event.key.length > 1) ||
    ((event.key === '-') && (!(event.currentTarget as HTMLInputElement)?.value?.length)) ||
    intRx.test(event.key)
  ) return;

  event.preventDefault();
};

const ExtendLockTimeUI = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => {
  const extendingWeeksInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!extendingWeeksInputRef) return;
    if (!extendingWeeksInputRef.current) return;

    const countOfWeekInputRefCurrent = extendingWeeksInputRef.current;

    countOfWeekInputRefCurrent.addEventListener('keydown', handleExtendingLockTimeChange);

    return () => {
      countOfWeekInputRefCurrent.removeEventListener('keydown', handleExtendingLockTimeChange);
    };
  }, []);

  return (
    <div>
      <div
        className={clsx(
          'flex',
          'justify-between',
          className
        )}
        {...rest}>
        <div
          className={clsx(
            'inline-flex',
            'items-center',
            'space-x-1',
            // TODO: placeholder color
            { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            // TODO: placeholder color
            { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
          )}>
          <span>Extend lock time in weeks</span>
          <span className='text-xs'>(Optional):</span>
        </div>
        <div
          className={clsx(
            'inline-flex',
            'items-center',
            'space-x-2.5'
          )}>
          <NumberInput
            ref={extendingWeeksInputRef}
            id={EXTENDING_LOCK_TIME}
            name={EXTENDING_LOCK_TIME}
            className='!w-12'
            placeholder='0'
            pattern='/d+'
            step={1}
            min={MIN_EXTENDING_LOCK_TIME}
            max={MAX_EXTENDING_LOCK_TIME} />
          <span
            className={clsx(
              'text-xs',
              // TODO: placeholder color
              { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
              // TODO: placeholder color
              { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
            )}>
            Weeks
          </span>
        </div>
      </div>
      <label
        htmlFor={EXTENDING_LOCK_TIME}
        className={clsx(
          'text-xs',
          // TODO: placeholder color
          { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
          // TODO: placeholder color
          { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
        )}>
        Max {MAX_EXTENDING_LOCK_TIME} Weeks
      </label>
    </div>
  );
};

export default ExtendLockTimeUI;
