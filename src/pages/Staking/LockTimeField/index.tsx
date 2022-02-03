
import * as React from 'react';
import clsx from 'clsx';

import {
  TextFieldHelperText,
  TextFieldLabel
} from 'components/TextField';
import NumberInput, { Props as NumberInputProps } from 'components/NumberInput';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';

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
  error?: boolean;
  helperText?: JSX.Element | string;
}

type Ref = HTMLInputElement;
const LockTimeField = React.forwardRef<Ref, CustomProps & NumberInputProps>(({
  optional,
  id,
  name,
  error,
  helperText
}, ref): JSX.Element => {
  // ray test touch <<
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
  // ray test touch >>

  return (
    <div>
      <TextFieldLabel
        htmlFor={id}
        className={clsx(
          '!text-xs',
          LABEL_TEXT_COLOR_CLASSES
        )}
        required>
        Max {MAX_EXTENDING_LOCK_TIME} Weeks
      </TextFieldLabel>
      <div
        className={clsx(
          'flex',
          'justify-between',
          'items-center'
        )}>
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
            ref={ref}
            id={id}
            className={clsx(
              '!w-12',
              {
                [clsx(
                  { 'border-interlayCinnabar': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:border-kintsugiThunderbird': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
                  { 'text-interlayCinnabar': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'text-kintsugiThunderbird': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                )]: error
              }
            )}
            name={name}
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
      <TextFieldHelperText
        className={clsx(
          {
            [clsx(
              { 'text-interlayCinnabar': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
              { 'text-kintsugiThunderbird': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
            )]: error
          },
          'h-6'
        )}>
        {helperText}
      </TextFieldHelperText>
    </div>
  );
});
LockTimeField.displayName = 'LockTimeField';

export default LockTimeField;
