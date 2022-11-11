import { Meta, Story } from '@storybook/react';

import { CTA } from '../CTA';
import { P } from '../Text';
import { Flex, FlexProps } from '.';

const Template: Story<FlexProps> = (args) => <Flex {...args} />;

const Default = Template.bind({});
Default.args = {
  children: (
    <>
      <P>Flex children</P> <P>Flex children</P> <CTA>CTA</CTA>
    </>
  )
};

export { Default };

export default {
  title: 'Layout/Flex',
  component: Flex
} as Meta;
