import { Meta, Story } from '@storybook/react';

import { ScoreBar, ScoreBarProps } from '.';

const Template: Story<ScoreBarProps> = (args) => <ScoreBar {...args} />;

const Default = Template.bind({});

Default.args = {
  variant: 'default',
  label: 'New Collateralization',
  sublabel: '(high risk)',
  maxScore: 150
};

const Highlight = Template.bind({});

Highlight.args = {
  variant: 'highlight',
  label: 'Collateral Score',
  sublabel: 'High Risk: 0-150%',
  maxScore: 150
};

export { Default, Highlight };

export default {
  title: 'Components/ScoreBar',
  component: ScoreBar,
  decorators: [
    (Story) => (
      <div style={{ width: '50%', margin: 'auto', padding: 20 }}>
        <Story />
      </div>
    )
  ]
} as Meta;
