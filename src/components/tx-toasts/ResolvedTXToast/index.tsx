
import { Toast } from 'react-hot-toast/dist/core/types';
import useUnmount from 'react-use/lib/useUnmount';
import clsx from 'clsx';

import TXToast from 'components/tx-toasts/TXToast';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import { useTXToastInfoSet } from 'contexts/tx-toast-info-set-context';
import { ReactComponent as CheckIcon } from 'assets/img/icons/check.svg';

interface Props {
  t: Toast;
}

const ResolvedTXToast = ({
  t
}: Props): JSX.Element | null => {
  const {
    state,
    dispatch
  } = useTXToastInfoSet();

  useUnmount(() => {
    dispatch({
      type: 'remove-tx-toast-info',
      txToastID: t.id
    });
  });

  const txToastInfo = state.get(t.id);
  if (txToastInfo === undefined) {
    return null;
  }

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
      startTime={txToastInfo.startTime}
      count={txToastInfo.count} />
  );
};

export default ResolvedTXToast;
