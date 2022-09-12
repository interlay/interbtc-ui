import { Trans, useTranslation } from 'react-i18next';

import { ReactComponent as WarningIcon } from '@/assets/img/icons/exclamation-triangle.svg';
import { CTA, CTALink, H3, Link, Stack } from '@/component-library';
import {
  INTERLAY_DOS_AND_DONTS_DOCS_LINK,
  INTERLAY_TERMS_AND_CONDITIONS_LINK,
  INTERLAY_VAULT_DOCS_LINK
} from '@/config/links';

import {
  StyledDisclaimerBox,
  StyledDisclaimerList,
  StyledDisclaimerListItem,
  StyledDisclaimerText
} from './CreateVaultWizard.styles';
import { withStep } from './Step';
import { StepComponentProps } from './types';

type Props = {
  onClickAgree?: () => void;
};

type DisclaimerStepProps = Props & StepComponentProps;

const DisclaimerStep = ({ onClickAgree }: DisclaimerStepProps): JSX.Element | null => {
  const { t } = useTranslation();

  return (
    <Stack spacing='double'>
      <Stack spacing='none' alignItems='center'>
        <WarningIcon width='2.5rem' height='2.5rem' />
        <H3>{t('vault.vault_risks')}</H3>
      </Stack>
      <Stack>
        <StyledDisclaimerText>{t('vault.disclaimer.understand_risks')}</StyledDisclaimerText>
        <StyledDisclaimerText>
          {t('vault.disclaimer.running_vault_requirments')} {t('vault.disclaimer.understand_liquidation_risks')}
        </StyledDisclaimerText>
        <StyledDisclaimerBox>
          {t('vault.disclaimer.before_start_vault')}
          <StyledDisclaimerList>
            <StyledDisclaimerListItem>
              <Trans i18nKey='vault.disclaimer.check_do_s_and_dont_s'>
                Check the
                <Link href={INTERLAY_DOS_AND_DONTS_DOCS_LINK} target='_blank' rel='noreferrer' color='secondary'>
                  do&apos;s and dont&apos;s
                </Link>
                of correctly operating your vault client
              </Trans>
            </StyledDisclaimerListItem>
            <StyledDisclaimerListItem>
              <Trans i18nKey='vault.disclaimer.check_risks_involved'>
                Please check the information about
                <Link href={INTERLAY_VAULT_DOCS_LINK} target='_blank' rel='noreferrer' color='secondary'>
                  risks involved
                </Link>
                when operating a Vault on Interlay/Kintsugi
              </Trans>
            </StyledDisclaimerListItem>
          </StyledDisclaimerList>
        </StyledDisclaimerBox>
        <StyledDisclaimerBox>
          <Trans i18nKey='vault.disclaimer.confirm_agreement'>
            By proceeding you confirm that you have read and accepted the
            <Link href={INTERLAY_TERMS_AND_CONDITIONS_LINK} target='_blank' rel='noreferrer' color='secondary'>
              Terms & Conditions
            </Link>
          </Trans>
        </StyledDisclaimerBox>
      </Stack>
      <Stack>
        <CTA size='large' fullWidth onClick={onClickAgree}>
          {t('vault.disclaimer.accept_risks_involved')}
        </CTA>
        <CTALink
          as='a'
          href={INTERLAY_VAULT_DOCS_LINK}
          target='_blank'
          rel='noreferrer'
          variant='secondary'
          size='large'
          fullWidth
        >
          {t('vault.read_vault_documentation')}
        </CTALink>
      </Stack>
    </Stack>
  );
};

const componentStep = 1 as const;

export default withStep(DisclaimerStep, componentStep);
