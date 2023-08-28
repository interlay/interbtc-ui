import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { Card, CardProps, P } from '@/component-library';
import { AuthCTA } from '@/components';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { AccountStakingData } from '@/hooks/api/escrow/use-get-account-staking-data';
import { Transaction, useTransaction } from '@/hooks/transaction';
import { YEAR_MONTH_DAY_PATTERN } from '@/utils/constants/date-time';

type Props = {
  data: AccountStakingData;
  onClaimRewards: () => void;
};

type InheritAttrs = CardProps & Props;

type StakingWithdrawCardProps = Props & InheritAttrs;

const StakingWithdrawCard = ({ data, onClaimRewards, ...props }: StakingWithdrawCardProps): JSX.Element | null => {
  const { t } = useTranslation();

  const transaction = useTransaction(Transaction.ESCROW_WITHDRAW, {
    onSuccess: onClaimRewards
  });

  const handlePress = () => transaction.execute();

  return (
    <Card direction='column' gap='spacing4' {...props}>
      <P size='s'>
        Withdraw Staked {GOVERNANCE_TOKEN.ticker} on {format(data.unlock.date, YEAR_MONTH_DAY_PATTERN)}
      </P>
      <AuthCTA onPress={handlePress}>{t('withdraw')}</AuthCTA>
    </Card>
  );
};

export { StakingWithdrawCard };
export type { StakingWithdrawCardProps };
