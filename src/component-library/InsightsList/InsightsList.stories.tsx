import { Meta, Story } from '@storybook/react';

import { CTA } from '../CTA';
import { InsightsList, InsightsListItem, InsightsListProps } from '.';

const Template: Story<InsightsListProps> = (args) => (
  <InsightsList {...args}>
    <InsightsListItem title='Locked Collateral KSM' label='400' />
    <InsightsListItem title='Remaining kBTC capacity' label='93.5%' sublabel='(2.59643046 kBTC)' />
    <InsightsListItem title='Locked BTC' label='0.54538777' sublabel='($339.05)' />
    <InsightsListItem>
      <CTA fullWidth variant='primary'>
        Deposit Collateral
      </CTA>
      <CTA fullWidth variant='outlined'>
        Withdraw Collateral
      </CTA>
    </InsightsListItem>
  </InsightsList>
);

const Default = Template.bind({});
Default.args = {};

export { Default };

export default {
  title: 'Components/InsightsList',
  component: InsightsList
} as Meta;
