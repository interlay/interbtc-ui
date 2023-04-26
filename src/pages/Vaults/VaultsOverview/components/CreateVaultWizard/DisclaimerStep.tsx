import { Trans, useTranslation } from 'react-i18next';

import { CTA, CTALink, ModalBody, ModalFooter, Stack, TextLink } from '@/component-library';
import {
  INTERLAY_DOS_AND_DONTS_DOCS_LINK,
  INTERLAY_TERMS_AND_CONDITIONS_LINK,
  INTERLAY_VAULT_DOCS_LINK
} from '@/config/links';
import { StepComponentProps, withStep } from '@/utils/hocs/step';

import {
  StyledDisclaimerCard,
  StyledDisclaimerList,
  StyledDisclaimerListItem,
  StyledDisclaimerText,
  StyledModalHeader,
  StyledWarningIcon
} from './CreateVaultWizard.styles';

type Props = {
  onClickAgree?: () => void;
};

type DisclaimerStepProps = Props & StepComponentProps;

const DisclaimerStep = ({ onClickAgree }: DisclaimerStepProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <StyledModalHeader align='center'>
        <StyledWarningIcon />
        {t('vault.disclaimer.plase_read_before_you_start')}
      </StyledModalHeader>
      <ModalBody gap='spacing4'>
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
      </ModalBody>
      <ModalFooter>
        <CTA size='large' fullWidth onPress={onClickAgree}>
          {t('vault.disclaimer.accept_risks_involved')}
        </CTA>
        <CTALink external to={INTERLAY_VAULT_DOCS_LINK} variant='secondary' size='large' fullWidth>
          {t('vault.disclaimer.read_vault_documentation')}
        </CTALink>
      </ModalFooter>
    </>
  );
};

const componentStep = 1 as const;

export default withStep(DisclaimerStep, componentStep);
