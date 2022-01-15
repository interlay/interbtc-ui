
import { Toast } from 'react-hot-toast/dist/core/types';
import useInterval from 'react-use/lib/useInterval';
import useMount from 'react-use/lib/useMount';
import format from 'date-fns/format';
import clsx from 'clsx';

import TXToast from 'components/tx-toasts/TXToast';
import { useCount } from 'contexts/count-context';
import { ReactComponent as HistoryIcon } from 'assets/img/icons/history.svg';

interface Props {
  t: Toast;
}

const PendingTXToast = ({
  t
}: Props): JSX.Element => {
  const {
    state,
    dispatch
  } = useCount();

  useInterval(
    () => {
      dispatch({ type: 'increment-count' });
    },
    1000
  );

  useMount(() => {
    dispatch({ type: 'set-start-time' });
  });

  const startTime = state.startTime ? format(state.startTime, 'p') : '';

  return (
    <TXToast
      t={t}
      message={
        <span
          className={clsx(
            // ray test touch <<
            // TODO: kintsugi dark mode
            'text-interlayTextPrimaryInLightMode',
            'dark:text-kintsugiTextPrimaryInDarkMode'
            // ray test touch >>
          )}>
          Your transaction has started.
        </span>
      }
      icon={
        <HistoryIcon
          className={clsx(
            // ray test touch <<
            // TODO: kintsugi dark mode
            'text-interlayTextPrimaryInLightMode',
            'dark:text-kintsugiTextPrimaryInDarkMode'
            // ray test touch >>
          )}
          width={24}
          height={24} />
      }
      startTime={startTime}
      count={state.count} />
  );
};

export default PendingTXToast;
