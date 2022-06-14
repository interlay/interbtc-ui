import { Story, Meta } from '@storybook/react';

import { InfoBox, InfoBoxProps } from './';

const Template: Story<InfoBoxProps> = (args) => <InfoBox {...args} />;

const Default = Template.bind({});
Default.args = {
  title: 'Info box',
  text: 'Info box content'
};

export { Default };

export default {
  title: 'Components/InfoBox',
  component: InfoBox
} as Meta;
