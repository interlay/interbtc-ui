import { Meta, Story } from '@storybook/react';

import { P } from '../Text';
import { Accordion, AccordionItem, AccordionProps } from '.';

const Template: Story<AccordionProps> = (args) => (
  <Accordion {...args} disabledKeys={['3']}>
    <AccordionItem hasChildItems={false} key='1' title='Item 1'>
      <P>This is item 1 section</P>
    </AccordionItem>
    <AccordionItem hasChildItems={false} key='2' title='Item 2'>
      <P>This is item 2 section</P>
    </AccordionItem>
    <AccordionItem hasChildItems={false} key='3' title='Item 3'>
      <P>This is item 3 section</P>
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
