import { Meta, Story } from '@storybook/react';

import { CoinIcon, CoinIconProps } from './CoinIcon';
import * as ICONS from './icons';

const Template: Story<CoinIconProps> = (args) => {
  const icons = Object.keys(ICONS);
  return (
    <>
      {icons.map((icon) => (
        <CoinIcon {...args} key={icon} ticker={icon} />
      ))}
    </>
  );
};

const Default = Template.bind({});
Default.args = {
  size: 'lg',
  ticker: undefined
};

export { Default };

export default {
  title: 'Elements/CoinIcon',
  component: CoinIcon
} as Meta;
