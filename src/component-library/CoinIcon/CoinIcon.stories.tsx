import { Meta, Story } from '@storybook/react';

import { Flex } from '../Flex';
import { Span } from '../Text';
import { CoinIcon, CoinIconProps } from './CoinIcon';
import * as ICONS from './icons';

const Template: Story<CoinIconProps> = (args) => (
  <Flex gap='spacing4'>
    {Object.keys(ICONS).map((icon) => (
      <Flex key={icon} direction='column' gap='spacing1' justifyContent='center' alignItems='center'>
        <CoinIcon {...args} ticker={icon} />
        <Span size='xs'>{icon}</Span>
      </Flex>
    ))}
  </Flex>
);

const Default = Template.bind({});
Default.args = {
  size: 'xl',
  ticker: undefined
};

export { Default };

export default {
  title: 'Elements/CoinIcon',
  component: CoinIcon
} as Meta;
