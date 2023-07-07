import { useTranslation } from 'react-i18next';

import { Card, SwitchProps, Tooltip } from '@/component-library';

import { StyledInformationCircle, StyledSwitch } from './RedeemForm.styles';

type PremiumRedeemCardProps = { isPremiumRedeem?: boolean; switchProps: SwitchProps };

const PremiumRedeemCard = ({ isPremiumRedeem, switchProps }: PremiumRedeemCardProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Card
      direction='column'
      variant='bordered'
      background='tertiary'
      rounded='lg'
      gap='spacing4'
      padding='spacing4'
      flex='1'
    >
      <Tooltip label={t('btc.premium_redeem_info')}>
        <StyledSwitch isSelected={isPremiumRedeem} labelProps={{ size: 'xs' }} {...switchProps}>
          {t('btc.premium_redeem')}
          <StyledInformationCircle size='s' />
        </StyledSwitch>
      </Tooltip>
    </Card>
  );
};

export { PremiumRedeemCard };
export type { PremiumRedeemCardProps };
