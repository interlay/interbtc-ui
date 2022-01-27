
import {
  Story,
  Meta
} from '@storybook/react';

import TokenField, { Props } from './';

const Template: Story<Props> = args => <TokenField {...args} />;

const Default = Template.bind({});
Default.args = {
  id: 'id',
  label: 'BTC',
  approxUSD: '≈ $ 10.00'
};

export {
  Default
};

export default {
  title: 'TokenField',
  component: TokenField
} as Meta;
