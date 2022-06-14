import { Story, Meta } from '@storybook/react';

import { InfoBox, InfoBoxProps } from './';

const Template: Story<InfoBoxProps> = (args) => <InfoBox {...args} />;

const Default = Template.bind({});
Default.args = {
  title: 'My vaults at risk',
  text: '0'
};

export { Default };

export default {
  title: 'Components/InfoBox',
  component: InfoBox
} as Meta;
