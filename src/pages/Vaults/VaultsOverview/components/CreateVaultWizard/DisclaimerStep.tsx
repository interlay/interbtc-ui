import { Trans, useTranslation } from 'react-i18next';

import { CTA, CTALink, H3, Stack, TextLink } from '@/component-library';
import {
  INTERLAY_DOS_AND_DONTS_DOCS_LINK,
  INTERLAY_TERMS_AND_CONDITIONS_LINK,
  INTERLAY_VAULT_DOCS_LINK
} from '@/config/links';

import {
  StyledDisclaimerCard,
  StyledDisclaimerList,
  StyledDisclaimerListItem,
  StyledDisclaimerText,
  StyledWarningIcon
} from './CreateVaultWizard.styles';
import { StepComponentProps, withStep } from './Step';

type Props = {
  onClickAgree?: () => void;
};

type DisclaimerStepProps = Props & StepComponentProps;

const DisclaimerStep = ({ onClickAgree }: DisclaimerStepProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Stack spacing='double'>
      <Stack spacing='none' alignItems='center'>
        <StyledWarningIcon />
        <H3>{t('vault.disclaimer.plase_read_before_you_start')}</H3>
      </Stack>
      <Stack>
        <StyledDisclaimerText>{t('vault.disclaimer.understand_risks')}</StyledDisclaimerText>
        <StyledDisclaimerText>
          {t('vault.disclaimer.running_vault_requirments')} {t('vault.disclaimer.understand_liquidation_risks')}
        </StyledDisclaimerText>
        <StyledDisclaimerCard color='secondary'>
          {t('vault.disclaimer.before_start_vault')}
          <StyledDisclaimerList>
            <StyledDisclaimerListItem>
              <Trans i18nKey='vault.disclaimer.check_do_s_and_dont_s'>
                Check the
                <TextLink to={INTERLAY_DOS_AND_DONTS_DOCS_LINK} external color='secondary'>
                  do&apos;s and dont&apos;s
                </TextLink>
                of correctly operating your vault client
              </Trans>
            </StyledDisclaimerListItem>
            <StyledDisclaimerListItem>
              <Trans i18nKey='vault.disclaimer.check_risks_involved'>
                Please check the information about
                <TextLink to={INTERLAY_VAULT_DOCS_LINK} external color='secondary'>
                  risks involved
                </TextLink>
                when operating a Vault on Interlay/Kintsugi
              </Trans>
            </StyledDisclaimerListItem>
          </StyledDisclaimerList>
        </StyledDisclaimerCard>
        <StyledDisclaimerCard color='secondary'>
          <Trans i18nKey='vault.disclaimer.confirm_agreement'>
            By proceeding you confirm that you have read and accepted the
            <TextLink to={INTERLAY_TERMS_AND_CONDITIONS_LINK} external color='secondary'>
              Terms & Conditions
            </TextLink>
          </Trans>
        </StyledDisclaimerCard>
      </Stack>
      <Stack>
        <CTA size='large' fullWidth onClick={onClickAgree}>
          {t('vault.disclaimer.accept_risks_involved')}
        </CTA>
        <CTALink external to={INTERLAY_VAULT_DOCS_LINK} variant='secondary' size='large' fullWidth>
          {t('vault.disclaimer.read_vault_documentation')}
        </CTALink>
      </Stack>
    </Stack>
  );
};

const componentStep = 1 as const;

export default withStep(DisclaimerStep, componentStep);
