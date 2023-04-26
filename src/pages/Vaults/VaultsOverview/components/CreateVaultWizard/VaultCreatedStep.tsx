import { CollateralCurrencyExt } from '@interlay/interbtc-api';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { CoinPair, CTALink, H4, ModalBody, ModalFooter, ModalHeader, Stack } from '@/component-library';
import { WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import { URL_PARAMETERS } from '@/utils/constants/links';
import { StepComponentProps, withStep } from '@/utils/hocs/step';

type Props = {
  collateralCurrency: CollateralCurrencyExt;
};

type VaultCreatedStepProps = StepComponentProps & Props;

const VaultCreatedStep = ({ collateralCurrency }: VaultCreatedStepProps): JSX.Element => {
  const { t } = useTranslation();
  const { [URL_PARAMETERS.VAULT.ACCOUNT]: accountAddress } = useParams<Record<string, string>>();

  return (
    <>
      <ModalHeader>{t('vault.vault_created')}</ModalHeader>
      <ModalBody>
        <Stack spacing='double' alignItems='center'>
          <Stack alignItems='center'>
            <CoinPair coinOne={collateralCurrency.ticker} coinTwo={WRAPPED_TOKEN_SYMBOL} size='xl2' />
            <H4 color='tertiary'>
              {collateralCurrency.ticker} - {WRAPPED_TOKEN_SYMBOL}
            </H4>
          </Stack>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <CTALink size='large' fullWidth to={`${accountAddress}/${collateralCurrency.ticker}/${WRAPPED_TOKEN_SYMBOL}`}>
          {t('vault.view_vault')}
        </CTALink>
      </ModalFooter>
    </>
  );
};

const componentStep = 3 as const;

export default withStep(VaultCreatedStep, componentStep);
