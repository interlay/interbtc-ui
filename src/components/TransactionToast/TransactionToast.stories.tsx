import { Meta, Story } from '@storybook/react';

import { TransactionToast, TransactionToastProps } from './TransactionToast';

const Template: Story<TransactionToastProps> = (args) => <TransactionToast {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'Your are awesome 👊🏼',
  description: 'sdkjdnjf jdnkjn kd dkjn kdjn kdj kjn kdjn kjdn  dkjn dkn kdjn kdjn dkjn kdjn kdjn kdjn kdjn kdjn kdjn d'
};

export { Default };

export default {
  title: 'A/TransactionToast',
  component: TransactionToast
} as Meta;
