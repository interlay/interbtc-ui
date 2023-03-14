import { useTranslation } from 'react-i18next';

import { Card, Flex, P, Strong } from '@/component-library';
import { LoanType } from '@/types/loans';

type LoanTablePlaceholderProps = {
  variant?: LoanType;
};

const LoanTablePlaceholder = ({ variant = 'lend' }: LoanTablePlaceholderProps): JSX.Element | null => {
  const { t } = useTranslation();

  return (
    <Card flex='1' justifyContent='center' alignItems='center'>
      <Flex direction='column' gap='spacing2' alignItems='center'>
        <Strong>{t('no_loan_positions', { loanType: variant })}</Strong>
        <P>{t('your_loan_positions_will_show_here', { loanType: variant })}</P>
      </Flex>
    </Card>
  );
};

export { LoanTablePlaceholder };
export type { LoanTablePlaceholderProps };
