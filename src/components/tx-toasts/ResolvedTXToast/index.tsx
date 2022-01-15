
import { Toast } from 'react-hot-toast/dist/core/types';
import useUnmount from 'react-use/lib/useUnmount';
import format from 'date-fns/format';

import TXToast from 'components/tx-toasts/TXToast';
import { useCount } from 'contexts/count-context';
import { ReactComponent as CheckIcon } from 'assets/img/icons/check.svg';

interface Props {
  t: Toast;
}

const ResolvedTXToast = ({
  t
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
      t={t}
      message={
        // ray test touch <<
        <span className='text-farmersOnlyBilbao'>
          Successfully done.
        </span>
        // ray test touch >>
      }
      icon={
        <CheckIcon
          // ray test touch <<
          className='text-farmersOnlyBilbao'
          // ray test touch >>
          width={18}
          height={13} />
      }
      startTime={startTime}
      count={state.count} />
  );
};

export default ResolvedTXToast;
