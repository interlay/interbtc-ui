
import * as React from 'react';
import clsx from 'clsx';

import {
  TextFieldHelperText,
  TextFieldLabel
} from 'components/TextField';
import NumberInput, { Props as NumberInputProps } from 'components/NumberInput';
import { STAKE_LOCK_TIME } from 'config/relay-chains';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';

// MEMO: inspired by https://medium.com/codex/making-html-5-numeric-inputs-only-accept-integers-d3d117973d56
const integerRegexPattern = /\d/;
const handleLockTimeChange = (event: KeyboardEvent) => {
  if (
    (event.key.length > 1) ||
    integerRegexPattern.test(event.key)
  ) return;

  event.preventDefault();
};

const LABEL_TEXT_COLOR_CLASSES = clsx(
  { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
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
  helperText,
  ...rest
}, ref): JSX.Element => {
  const wrappingRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!wrappingRef) return;
    if (!wrappingRef.current) return;

    const wrappingRefCurrent = wrappingRef.current;

    wrappingRefCurrent.addEventListener('keydown', handleLockTimeChange);

    return () => {
      wrappingRefCurrent.removeEventListener('keydown', handleLockTimeChange);
    };
  }, []);

  return (
    <div>
      <TextFieldLabel
        htmlFor={id}
        className={clsx(
          '!text-xs',
          LABEL_TEXT_COLOR_CLASSES
        )}
        required={optional === false}>
        Max {STAKE_LOCK_TIME.MAX} Weeks
      </TextFieldLabel>
      <div
        className={clsx(
          'flex',
          'justify-between',
          'items-center'
        )}>
        {optional === true && (
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
        )}
        {optional === false && (
          <span className={LABEL_TEXT_COLOR_CLASSES}>
            Choose lock time in weeks:
          </span>
        )}
        {optional === undefined && (
          <span className={LABEL_TEXT_COLOR_CLASSES}>
            Checking...
          </span>
        )}
        <div
          className={clsx(
            'inline-flex',
            'items-center',
            'space-x-2.5'
          )}
          ref={wrappingRef}>
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
            min={STAKE_LOCK_TIME.MIN}
            max={STAKE_LOCK_TIME.MAX}
            {...rest} />
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
