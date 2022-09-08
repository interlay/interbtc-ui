import { Trans, useTranslation } from 'react-i18next';

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
import { StepComponentProps } from './types';

type Props = {
  onClickAgree?: () => void;
};

type DisclaimerStepProps = Props & StepComponentProps;

const componentStep = 1 as const;

const DisclaimerStep = ({ step, onClickAgree }: DisclaimerStepProps): JSX.Element | null => {
  const { t } = useTranslation();

  if (step !== componentStep) {
    return null;
  }

  return (
    <Stack spacing='double'>
      <Stack spacing='half' alignItems='center'>
        <svg width='46' height='40' viewBox='0 0 46 40' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M45.778 37.551L24.422 0.816327C24.1037 0.270408 23.5544 0 23 0C22.4456 0 21.8911 0.270408 21.578 0.816327L0.222047 37.551C-0.40939 38.6429 0.38119 40 1.64406 40H44.3559C45.6188 40 46.4094 38.6429 45.778 37.551ZM21.3572 15.102C21.3572 14.8776 21.542 14.6939 21.7679 14.6939H24.2321C24.458 14.6939 24.6428 14.8776 24.6428 15.102V24.4898C24.6428 24.7143 24.458 24.898 24.2321 24.898H21.7679C21.542 24.898 21.3572 24.7143 21.3572 24.4898V15.102ZM23 33.0612C22.3552 33.0481 21.7412 32.7844 21.2898 32.3265C20.8385 31.8687 20.5856 31.2532 20.5856 30.6122C20.5856 29.9713 20.8385 29.3558 21.2898 28.898C21.7412 28.4401 22.3552 28.1763 23 28.1633C23.6448 28.1763 24.2588 28.4401 24.7102 28.898C25.1615 29.3558 25.4144 29.9713 25.4144 30.6122C25.4144 31.2532 25.1615 31.8687 24.7102 32.3265C24.2588 32.7844 23.6448 33.0481 23 33.0612Z'
            fill='white'
          />
        </svg>
        <H3>Vault Risks</H3>
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
          I understand the risks involved
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
          Read the Vault documentation
        </CTALink>
      </Stack>
    </Stack>
  );
};

export { DisclaimerStep };
