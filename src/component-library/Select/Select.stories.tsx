import { Meta, Story } from '@storybook/react';

import { CoinIcon } from '../CoinIcon';
import { Flex } from '../Flex';
import { SelectTrigger, SelectTriggerProps } from './SelectTrigger';

const Template: Story<SelectTriggerProps> = (args) => <SelectTrigger {...args} />;
const Trigger = Template.bind({});
Trigger.args = {
  size: 'large',
  children: (
    <Flex gap='spacing2' alignItems='center'>
      <CoinIcon ticker='BTC' size='lg' />
      BTC
    </Flex>
  )
};

export { Trigger };

export default {
  title: 'Forms/Select',
  component: Trigger
} as Meta;
