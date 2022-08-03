import { Meta, Story } from '@storybook/react';

import { CollateralScore, CollateralScoreProps } from '.';

const Template: Story<CollateralScoreProps> = (args) => <CollateralScore {...args} />;

const Default = Template.bind({});

Default.args = {
  variant: 'default',
  label: 'New Collateralization',
  sublabel: '(high risk)'
};

const Highlight = Template.bind({});

Highlight.args = {
  variant: 'highlight',
  label: 'Collateral Score',
  sublabel: 'High Risk: 0-150%'
};

export { Default, Highlight };

export default {
  title: 'Components/CollateralScore',
  component: CollateralScore,
  decorators: [
    (Story) => (
      <div style={{ width: '50%', margin: 'auto', padding: 20 }}>
        <Story />
      </div>
    )
  ]
} as Meta;
