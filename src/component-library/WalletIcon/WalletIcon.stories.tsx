import { Meta, Story } from '@storybook/react';

import { Flex } from '../Flex';
import { Span } from '../Text';
import { WalletIcon, WalletIconProps } from './WalletIcon';

const Template: Story<WalletIconProps> = (args) => (
  <Flex gap='spacing4' wrap>
    <Flex direction='column' gap='spacing1' justifyContent='center' alignItems='center'>
      <WalletIcon {...args} name='subwallet-js' />
      <Span size='xs'>SubWallet</Span>
    </Flex>
    <Flex direction='column' gap='spacing1' justifyContent='center' alignItems='center'>
      <WalletIcon {...args} name='talisman' />
      <Span size='xs'>Talisman</Span>
    </Flex>
    <Flex direction='column' gap='spacing1' justifyContent='center' alignItems='center'>
      <WalletIcon {...args} name='polkadot-js' />
      <Span size='xs'>Polkadot.js</Span>
    </Flex>
  </Flex>
);

const Default = Template.bind({});
Default.args = {
  size: 'xl'
};

export { Default };

export default {
  title: 'Elements/WalletIcon',
  component: WalletIcon
} as Meta;
