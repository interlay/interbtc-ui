import { Story, Meta } from '@storybook/react';

import { NewVaultsTable } from './';

const Template: Story = (args) => <NewVaultsTable {...args} />;

const Default = Template.bind({});
Default.args = {
    columnLabels: ['test1', 'test2'],
    rows: [[1,2], [11, 12], ["a", 35]]
};

export { Default };

export default {
  title: 'Components/NewVaultsTable',
  component: NewVaultsTable
} as Meta;
