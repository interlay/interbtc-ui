import { Item } from '@react-stately/collections';
import { Meta, Story } from '@storybook/react';

import { CoinIcon } from '../CoinIcon';
import { Flex } from '../Flex';
import { Select, SelectProps } from './Select';
import { SelectTrigger, SelectTriggerProps } from './SelectTrigger';

const SelectTemplate: Story<SelectProps<any>> = (args) => {
  return (
    <Select {...args}>
      <Item textValue='BTC' key='BTC'>
        <Flex alignItems='center' gap='spacing2'>
          <CoinIcon ticker='BTC' /> BTC
        </Flex>
      </Item>
      <Item textValue='DOT' key='DOT'>
        <Flex alignItems='center' gap='spacing2'>
          <CoinIcon ticker='DOT' /> DOT
        </Flex>
      </Item>
      <Item textValue='KSM' key='KSM'>
        <Flex alignItems='center' gap='spacing2'>
          <CoinIcon ticker='KSM' /> KSM
        </Flex>
      </Item>
      <Item textValue='KINT' key='KINT'>
        <Flex alignItems='center' gap='spacing2'>
          <CoinIcon ticker='KINT' /> KINT
        </Flex>
      </Item>
      <Item textValue='INTR' key='INTR'>
        <Flex alignItems='center' gap='spacing2'>
          <CoinIcon ticker='INTR' /> INTR
        </Flex>
      </Item>
      <Item textValue='USDT' key='USDT'>
        <Flex alignItems='center' gap='spacing2'>
          <CoinIcon ticker='USDT' /> USDT
        </Flex>
      </Item>
    </Select>
  );
};

const Default = SelectTemplate.bind({});
Default.args = {
  type: 'modal',
  modalTitle: 'Select Token',
  placeholder: 'placeholder',
  label: 'Coin',
  description: 'Select a coin',
  size: 'large'
};

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

export { Default, Trigger };

export default {
  title: 'Forms/Select',
  component: Trigger
} as Meta;
