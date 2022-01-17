
import * as React from 'react';
import useInterval from 'react-use/lib/useInterval';
import {
  Story,
  Meta
} from '@storybook/react';
import toast from 'react-hot-toast';
import clsx from 'clsx';

import TransactionToaster from '.';
import PendingTXToast from 'components/tx-toasts/PendingTXToast';
import RejectedTXToast from 'components/tx-toasts/RejectedTXToast';
import ResolvedTXToast from 'components/tx-toasts/ResolvedTXToast';

type TXType = 'Resolved' | 'Rejected';

const notifyTXPendingToast = (txType: TXType) => () => {
  if (txType === 'Resolved') {
    txToastIDForResolvedTX = toast(
      t => <PendingTXToast t={t} />,
      {
        duration: Infinity
      }
    );
  }

  if (txType === 'Rejected') {
    txToastIDForRejectedTX = toast(
      t => <PendingTXToast t={t} />,
      {
        duration: Infinity
      }
    );
  }
};

const notifyTXResolvedToast = () => {
  toast(
    t => <ResolvedTXToast t={t} />,
    {
      duration: 2000,
      id: txToastIDForResolvedTX
    }
  );

  txToastIDForResolvedTX = '';
};

const notifyTXRejectedToast = () => {
  toast(
    t => <RejectedTXToast t={t} />,
    {
      duration: 4000,
      id: txToastIDForRejectedTX
    }
  );

  txToastIDForRejectedTX = '';
};

let txToastIDForResolvedTX: string;
let txToastIDForRejectedTX: string;
const TIMER_THRESHOLD = 5;

const Template: Story = args => {
  const [countForResolvedTX, setCountForResolvedTX] = React.useState(0);
  const [countForRejectedTX, setCountForRejectedTX] = React.useState(0);

  useInterval(
    () => {
      if (txToastIDForResolvedTX) {
        setCountForResolvedTX(prev => prev + 1);
        if (countForResolvedTX === TIMER_THRESHOLD) {
          notifyTXResolvedToast();
          setCountForResolvedTX(0);
        }
      }

      if (txToastIDForRejectedTX) {
        setCountForRejectedTX(prev => prev + 1);
        if (countForRejectedTX === TIMER_THRESHOLD) {
          notifyTXRejectedToast();
          setCountForRejectedTX(0);
        }
      }
    },
    1000
  );

  return (
    <>
      <div
        className={clsx(
          'flex',
          'flex-col',
          'items-start'
        )}>
        <button
          onClick={notifyTXPendingToast('Resolved')}
          disabled={!!txToastIDForResolvedTX}>
          ResolvedTXToast
        </button>
        <button
          onClick={notifyTXPendingToast('Rejected')}
          disabled={!!txToastIDForRejectedTX}>
          RejectedTXToast
        </button>
      </div>
      <TransactionToaster {...args} />
    </>
  );
};

const Default = Template.bind({});
Default.args = {};

export {
  Default
};

export default {
  title: 'TransactionToaster',
  component: TransactionToaster
} as Meta;
