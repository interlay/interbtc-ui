import { HTMLAttributes } from 'react';

import { CTA, InsightsList, InsightsListItem, Stack } from '@/component-library';

type Props = {
  data?: any;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type VaultInsightsProps = Props & NativeAttrs;

const VaultInsights = (props: VaultInsightsProps): JSX.Element => {
  return (
    <Stack {...props}>
      <InsightsList>
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
      <InsightsList>
        <InsightsListItem title='APY' label='0.23%' />
        <InsightsListItem title='Fees Earned kBTC' label='0.00045' sublabel='($17.01)' />
        <InsightsListItem title='Earned KINT' label='25.134' sublabel='($339.05)' />
        <InsightsListItem>
          <CTA fullWidth variant='outlined'>
            Claim Your Rewards
          </CTA>
        </InsightsListItem>
      </InsightsList>
    </Stack>
  );
};

export default VaultInsights;
