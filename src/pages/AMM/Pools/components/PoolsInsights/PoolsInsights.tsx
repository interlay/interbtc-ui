import { useTranslation } from 'react-i18next';

import { Card, Dl, DlGroup } from '@/component-library';

import { StyledDd, StyledDt } from './PoolsInsights.style';

type PoolsInsightsProps = any;

const PoolsInsights = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Dl wrap direction='row'>
      <Card flex='1'>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
          <StyledDt color='primary'>{t('supply_balance')}</StyledDt>
          <StyledDd color='secondary'>$1205.15</StyledDd>
        </DlGroup>
      </Card>
      <Card flex='1'>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
          <StyledDt color='primary'>{t('total_liquidity')}</StyledDt>
          <StyledDd color='secondary'>$4,018,894</StyledDd>
        </DlGroup>
      </Card>
      <Card
        direction='row'
        // flex={hasSubsidyRewards ? '1.5' : '1'}
        flex='1'
        gap='spacing2'
        alignItems='center'
        justifyContent='space-between'
      >
        <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
          <StyledDt color='primary'>{t('rewards')}</StyledDt>
          <StyledDd color='secondary'>12.245678</StyledDd>
        </DlGroup>
        {/* {hasSubsidyRewards && (
            <CTA onClick={handleClickClaimRewards} loading={claimRewardsMutation.isLoading}>
              Claim
            </CTA>
          )} */}
      </Card>
    </Dl>
  );
};

export { PoolsInsights };
export type { PoolsInsightsProps };
