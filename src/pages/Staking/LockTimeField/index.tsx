
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

const LABEL_TEXT_COLOR_CLASSES = clsx(
  // TODO: placeholder color
  { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
  // TODO: placeholder color
  { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
);

interface CustomProps {
  optional?: boolean;
}

const LockTimeField = ({
  className,
  optional,
  ...rest
}: CustomProps & React.ComponentPropsWithRef<'div'>): JSX.Element => {
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
      <label
        htmlFor={EXTENDING_LOCK_TIME}
        className={clsx(
          'text-xs',
          LABEL_TEXT_COLOR_CLASSES
        )}>
        Max {MAX_EXTENDING_LOCK_TIME} Weeks
      </label>
      <div
        className={clsx(
          'flex',
          'justify-between',
          'items-center',
          className
        )}
        {...rest}>
        {optional ? (
          <div
            className={clsx(
              'inline-flex',
              'items-center',
              'space-x-1',
              LABEL_TEXT_COLOR_CLASSES
            )}>
            <span>Extend lock time in weeks</span>
            <span className='text-xs'>(Optional):</span>
          </div>
        ) : (
          <span
            className={LABEL_TEXT_COLOR_CLASSES}>
            Choose lock time in weeks:
          </span>
        )}
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
              LABEL_TEXT_COLOR_CLASSES
            )}>
            Weeks
          </span>
        </div>
      </div>
    </div>
  );
};

export default LockTimeField;
