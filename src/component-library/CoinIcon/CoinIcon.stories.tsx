import { Meta, Story } from '@storybook/react';

import { Flex } from '../Flex';
import { Span } from '../Text';
import { CoinIcon, CoinIconProps } from './CoinIcon';
import * as ICONS from './icons';

const Template: Story<CoinIconProps> = (args) => (
  <Flex gap='spacing4' wrap>
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

const LPTokensTemplate: Story<CoinIconProps> = (args) => {
  return (
    <Flex gap='spacing4' wrap>
      <Flex direction='column' gap='spacing1' justifyContent='center' alignItems='center'>
        <CoinIcon {...args} ticker='LP KBTC-KSM' tickers={['KBTC', 'KSM']} />
        <Span size='xs'>LP KBTC-KSM</Span>
      </Flex>
      <Flex direction='column' gap='spacing1' justifyContent='center' alignItems='center'>
        <CoinIcon {...args} ticker='LP IBTC-INTR-DOT' tickers={['IBTC', 'INTR', 'DOT']} />
        <Span size='xs'>LP IBTC-INTR-DOT</Span>
      </Flex>
      <Flex direction='column' gap='spacing1' justifyContent='center' alignItems='center'>
        <CoinIcon {...args} ticker='LP IBTC-INTR-DOT-USDT' tickers={['IBTC', 'INTR', 'DOT', 'USDT']} />
        <Span size='xs'>LP IBTC-INTR-DOT-USDT</Span>
      </Flex>
      <Flex direction='column' gap='spacing1' justifyContent='center' alignItems='center'>
        <CoinIcon {...args} ticker='KSM+(LKSM+VKSM+SKSM)' tickers={['KSM', 'LKSM', 'VKSM', 'SKSM']} />
        <Span size='xs'>KSM+(LKSM+VKSM+SKSM)</Span>
      </Flex>
    </Flex>
  );
};

const LPTokens = LPTokensTemplate.bind({});
LPTokens.args = {
  size: 'xl',
  ticker: undefined
};

export { Default, LPTokens };

export default {
  title: 'Elements/CoinIcon',
  component: CoinIcon
} as Meta;
