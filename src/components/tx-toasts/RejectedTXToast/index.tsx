
import { Toast } from 'react-hot-toast/dist/core/types';
import clsx from 'clsx';
import useUnmount from 'react-use/lib/useUnmount';
import format from 'date-fns/format';

import TXToast from 'components/tx-toasts/TXToast';
import { useCount } from 'contexts/count-context';
import { ReactComponent as WarningOutlineIcon } from 'assets/img/icons/warning-outline.svg';

interface Props {
  t: Toast;
  message?: string;
}

const RejectedTXToast = ({
  t,
  message
}: Props): JSX.Element => {
  const {
    state,
    dispatch
  } = useCount();

  useUnmount(() => {
    dispatch({ type: 'reset-start-time' });
    dispatch({ type: 'reset-count' });
  });

  const startTime = state.startTime ? format(state.startTime, 'p') : '';

  return (
    <TXToast
      className={clsx(
        // ray test touch <<
        '!bg-farmersOnlyPersianRed',
        'dark:!bg-farmersOnlySunsetOrange',
        // ray test touch >>
        '!bg-opacity-5',
        'dark:!bg-opacity-5'
      )}
      t={t}
      message={
        <span
          className={clsx(
            // ray test touch <<
            'text-farmersOnlyPersianRed',
            'dark:text-farmersOnlySunsetOrange'
            // ray test touch >>
          )}>
          {message || 'Transaction failed.'}
        </span>
      }
      icon={
        <WarningOutlineIcon
          className={clsx(
            // ray test touch <<
            'text-farmersOnlyPersianRed',
            'dark:text-farmersOnlySunsetOrange'
            // ray test touch >>
          )}
          width={22}
          height={19} />
      }
      startTime={startTime}
      count={state.count} />
  );
};

export default RejectedTXToast;
