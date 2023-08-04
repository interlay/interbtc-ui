import { Trans, useTranslation } from 'react-i18next';

import { P, TextLink } from '@/component-library';
import { TERMS_AND_CONDITIONS_LINK } from '@/config/relay-chains';

type DisclaimerProps = {
  showSignTerms?: boolean;
};

const Disclaimer = ({ showSignTerms }: DisclaimerProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <P size='s'>
      <Trans i18nKey='exclude_us_citizens'>
        By proceeding you confirm that you have read and accepted the{' '}
        <TextLink external to={TERMS_AND_CONDITIONS_LINK} underlined>
          terms and conditions
        </TextLink>
        , and represent and warrant that you are not a Resident of the United States or a &quot;U.S. person&quot; within
        the meaning of Rule 902(k) under the United States Securities Act of 1933 (the &quot;Securities Act&quot;).{' '}
      </Trans>
      {showSignTerms && t('account_modal.sign_terms')}
    </P>
  );
};

export { Disclaimer };
export type { DisclaimerProps };
