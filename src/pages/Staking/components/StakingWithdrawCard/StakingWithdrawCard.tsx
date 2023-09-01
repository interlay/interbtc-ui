import { format } from 'date-fns';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, CardProps, P } from '@/component-library';
import { AuthCTA, ClaimModal } from '@/components';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { AccountStakingData } from '@/hooks/api/escrow/use-get-account-staking-data';
import { Transaction, useTransaction } from '@/hooks/transaction';
import { YEAR_MONTH_DAY_PATTERN } from '@/utils/constants/date-time';

type Props = {
  data: AccountStakingData;
  onWithdraw: () => void;
};

type InheritAttrs = CardProps & Props;

type StakingWithdrawCardProps = Props & InheritAttrs;

const StakingWithdrawCard = ({ data, onWithdraw, ...props }: StakingWithdrawCardProps): JSX.Element => {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);

  const transaction = useTransaction(Transaction.ESCROW_WITHDRAW, {
    onSuccess: onWithdraw
  });

  const handleSubmit = () => transaction.execute();

  const handleOpen = () => transaction.fee.estimate();

  const handlePress = () => setOpen(true);

  return (
    <>
      <Card direction='column' gap='spacing4' {...props}>
        <P size='s'>
          {t('staking_page.withdraw_staked_ticker_on_date', {
            ticker: GOVERNANCE_TOKEN.ticker
          })}{' '}
          {format(data.unlock.date, YEAR_MONTH_DAY_PATTERN)}
        </P>
        <AuthCTA disabled={!data.unlock.isAvailable} onPress={handlePress}>
          {t('withdraw')}
        </AuthCTA>
      </Card>
      <ClaimModal
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        title={t('staking_page.withdraw_staked_ticker', { ticker: GOVERNANCE_TOKEN.ticker })}
        submitLabel={t('withdraw')}
        transaction={transaction}
        onSubmit={handleSubmit}
        onOpen={handleOpen}
      />
    </>
  );
};

export { StakingWithdrawCard };
export type { StakingWithdrawCardProps };
