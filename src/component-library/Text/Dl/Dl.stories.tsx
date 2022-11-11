import { Meta, Story } from '@storybook/react';

import { Dd, Dl, DlGroup, DlProps, Dt } from '.';

const Template: Story<DlProps> = ({ justifyContent, ...args }) => (
  <Dl {...args}>
    <DlGroup justifyContent={justifyContent}>
      <Dt>Term</Dt>
      <Dd>Description</Dd>
    </DlGroup>
    <DlGroup justifyContent={justifyContent}>
      <Dt>Term</Dt>
      <Dd>Description</Dd>
    </DlGroup>
    <DlGroup justifyContent={justifyContent}>
      <Dt>Term</Dt>
      <Dd>Description</Dd>
    </DlGroup>
  </Dl>
);

const Default = Template.bind({});
Default.args = {};

export { Default };

export default {
  title: 'Text/Dl',
  component: Dl
} as Meta;
