
import { Toast } from 'react-hot-toast/dist/core/types';
import useInterval from 'react-use/lib/useInterval';
import useMount from 'react-use/lib/useMount';
import clsx from 'clsx';

import TXToast from 'components/tx-toasts/TXToast';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import { useTXToastInfoSet } from 'contexts/tx-toast-info-set-context';
import { ReactComponent as HistoryIcon } from 'assets/img/icons/history.svg';

interface Props {
  t: Toast;
}

const PendingTXToast = ({
  t
}: Props): JSX.Element | null => {
  const {
    state,
    dispatch
  } = useTXToastInfoSet();

  useInterval(
    () => {
      dispatch({
        type: 'increment-count',
        txToastID: t.id
      });
    },
    1000
  );

  useMount(() => {
    dispatch({
      type: 'add-tx-toast-info',
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
            { 'text-interlayTextPrimaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:text-kintsugiTextPrimaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
          )}>
          Your transaction has started.
        </span>
      }
      icon={
        <HistoryIcon
          className={clsx(
            { 'text-interlayTextPrimaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:text-kintsugiTextPrimaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
          )}
          width={24}
          height={24} />
      }
      startTime={txToastInfo.startTime}
      count={txToastInfo.count} />
  );
};

export default PendingTXToast;
