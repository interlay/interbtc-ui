import { Meta, Story } from '@storybook/react';

import { Dl, DlProps } from '.';

const Template: Story<DlProps> = (args) => <Dl {...args} />;

const Default = Template.bind({});
Default.args = {
  listItems: [
    { term: 'Item', definition: 'Definition' },
    { term: 'Item', definition: 'Definition' },
    { term: 'Item', definition: 'Definition' },
    { term: 'Item', definition: 'Definition' }
  ]
};

export { Default };

export default {
  title: 'Text/Dl',
  component: Dl
} as Meta;
