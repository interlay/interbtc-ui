import { useTranslation } from 'react-i18next';

import { Card, SwitchProps, Tooltip } from '@/component-library';

import { StyledInformationCircle, StyledSwitch } from './RedeemForm.styles';

type PremiumRedeemCardProps = { isPremiumReddem?: boolean; switchProps: SwitchProps };

const PremiumRedeemCard = ({ isPremiumReddem, switchProps }: PremiumRedeemCardProps): JSX.Element => {
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
      <Tooltip label={t('redeem_page.premium_redeem_info')}>
        <StyledSwitch isSelected={isPremiumReddem} labelProps={{ size: 'xs' }} {...switchProps}>
          Premium Redeem
          <StyledInformationCircle size='s' />
        </StyledSwitch>
      </Tooltip>
    </Card>
  );
};

export { PremiumRedeemCard };
export type { PremiumRedeemCardProps };
