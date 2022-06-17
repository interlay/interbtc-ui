import { Story, Meta } from '@storybook/react';

import { InfoBox, InfoBoxProps } from './';

const Template: Story<InfoBoxProps> = (args) => <InfoBox {...args} />;

const WithoutCTA = Template.bind({});
WithoutCTA.args = {
  title: 'My vaults at risk',
  text: '0'
};

const WithCTA = Template.bind({});
WithCTA.args = {
  title: 'My vaults at risk',
  text: '0',
  ctaAction: () => {
    return null;
  },
  ctaText: 'Claim'
};

export { WithoutCTA, WithCTA };

export default {
  title: 'Components/InfoBox',
  component: InfoBox
} as Meta;
