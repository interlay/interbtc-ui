import { useTranslation } from 'react-i18next';

import { Flex, P, Strong } from '@/component-library';
import { LoanType } from '@/types/loans';

type LoanTablePlaceholderProps = {
  variant?: LoanType;
};

const LoanTablePlaceholder = ({ variant = 'lend' }: LoanTablePlaceholderProps): JSX.Element | null => {
  const { t } = useTranslation();

  return (
    <Flex direction='column' gap='spacing2' alignItems='center'>
      <Strong>{t('loans.no_loan_positions', { loanType: variant })}</Strong>
      <P>{t('loans.your_loan_positions_will_show_here', { loanType: variant })}</P>
    </Flex>
  );
};

export { LoanTablePlaceholder };
export type { LoanTablePlaceholderProps };
