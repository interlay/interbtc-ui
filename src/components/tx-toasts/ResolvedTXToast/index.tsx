
import { Toast } from 'react-hot-toast/dist/core/types';
import useUnmount from 'react-use/lib/useUnmount';
import format from 'date-fns/format';
import clsx from 'clsx';

import TXToast from 'components/tx-toasts/TXToast';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
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
        <span
          className={clsx(
            { 'text-interlayConifer': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:text-kintsugiApple': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
          )}>
          Successfully done.
        </span>
      }
      icon={
        <CheckIcon
          className={clsx(
            { 'text-interlayConifer': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:text-kintsugiApple': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
          )}
          width={18}
          height={13} />
      }
      startTime={startTime}
      count={state.count} />
  );
};

export default ResolvedTXToast;
