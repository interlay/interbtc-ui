import { Meta, Story } from '@storybook/react';

import { BreadcrumbItem, Breadcrumbs, BreadcrumbsProps } from '.';

const Template: Story<BreadcrumbsProps> = (args) => (
  <Breadcrumbs {...args}>
    <BreadcrumbItem>Strategies</BreadcrumbItem>
    <BreadcrumbItem>BTC Passive Income</BreadcrumbItem>
  </Breadcrumbs>
);

const Default = Template.bind({});
Default.args = {};

export { Default };

export default {
  title: 'Forms/Breadcrumbs',
  component: Breadcrumbs
} as Meta;
