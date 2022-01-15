
// ray test touch <<
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

const notifyTXPendingToast = () => toast(
  t => <PendingTXToast t={t} />,
  {
    duration: Infinity
  }
);
const notifyTXRejectedToast = () => toast(
  t => <RejectedTXToast t={t} />,
  {
    duration: Infinity
  }
);
const notifyTXResolvedToast = () => toast(
  t => <ResolvedTXToast t={t} />,
  {
    duration: Infinity
  }
);

const Template: Story = args => {
  return (
    <>
      <div
        className={clsx(
          'flex',
          'flex-col',
          'items-start'
        )}>
        <button onClick={notifyTXPendingToast}>PendingTXToast</button>
        <button onClick={notifyTXRejectedToast}>RejectedTXToast</button>
        <button onClick={notifyTXResolvedToast}>ResolvedTXToast</button>
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
// ray test touch >>
