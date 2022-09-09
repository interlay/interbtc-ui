import { CollateralIdLiteral } from '@interlay/interbtc-api';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { CoinPair, CTALink, H3, H4, Stack } from '@/component-library';
import { WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import { URL_PARAMETERS } from '@/utils/constants/links';

import { StepComponentProps } from './types';

type Props = {
  collateralToken: CollateralIdLiteral;
};

type VaultCreatedStepProps = StepComponentProps & Props;

const componentStep = 3 as const;

const VaultCreatedStep = ({ step, collateralToken }: VaultCreatedStepProps): JSX.Element | null => {
  const { t } = useTranslation();
  const { [URL_PARAMETERS.VAULT.ACCOUNT]: accountAddress } = useParams<Record<string, string>>();

  if (step !== componentStep) {
    return null;
  }

  return (
    <Stack spacing='double' alignItems='center'>
      <H3>{t('vault_created')}</H3>
      <Stack alignItems='center'>
        <CoinPair coinOne={collateralToken} coinTwo={WRAPPED_TOKEN_SYMBOL} size='large' />
        <H4 color='tertiary'>
          {collateralToken}-{WRAPPED_TOKEN_SYMBOL}
        </H4>
      </Stack>
      <CTALink size='large' fullWidth to={`${accountAddress}/${collateralToken}/${WRAPPED_TOKEN_SYMBOL}`}>
        {t('view_created')}
      </CTALink>
    </Stack>
  );
};

export { VaultCreatedStep };
