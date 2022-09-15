import { Meta, Story } from '@storybook/react';

import { TextLink, TextLinkProps } from '.';

const Template: Story<TextLinkProps> = (args) => <TextLink {...args} />;

const Default = Template.bind({});
Default.args = {
  external: true,
  to: 'https://interlay.io/',
  children: 'Link'
};

export { Default };

export default {
  title: 'Components/TextLink',
  component: TextLink
} as Meta;
