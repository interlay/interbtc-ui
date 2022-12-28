import { Meta, Story } from '@storybook/react';

import { P } from '../Text';
import { Accordion, AccordionItem, AccordionProps } from '.';

const Template: Story<AccordionProps> = (args) => (
  <Accordion {...args}>
    <AccordionItem key='1' title='test1'>
      <P>Hello</P>
    </AccordionItem>
  </Accordion>
);

const Default = Template.bind({});
Default.args = {};

export { Default };

export default {
  title: 'Components/Accordion',
  component: Accordion
} as Meta;
