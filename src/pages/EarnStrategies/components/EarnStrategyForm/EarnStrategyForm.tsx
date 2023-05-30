import { newMonetaryAmount } from '@interlay/interbtc-api';

import { Tabs, TabsItem } from '@/component-library';
import { WRAPPED_TOKEN } from '@/config/relay-chains';

import { EarnStrategyFormType, EarnStrategyRiskVariant } from '../../types/form';
import { EarnStrategyDepositForm } from './EarnStrategyDepositForm';
import { StyledEarnStrategyForm } from './EarnStrategyForm.style';
import { EarnStrategyWithdrawalForm } from './EarnStrategyWithdrawalForm';

interface EarnStrategyFormProps {
  riskVariant: EarnStrategyRiskVariant;
}

interface EarnStrategyFormBaseProps extends EarnStrategyFormProps {
  hasActiveStrategy: boolean | undefined;
}

type TabData = { type: EarnStrategyFormType; title: string };

const tabs: Array<TabData> = [
  {
    type: 'deposit',
    title: 'Deposit'
  },
  {
    type: 'withdraw',
    title: 'Withdraw'
  }
];

const EarnStrategyForm = ({ riskVariant }: EarnStrategyFormProps): JSX.Element => {
  // TODO: replace with actually withdrawable amount once we know how to get that information,
  // for now it's statically set for display purposes
  const maxWithdrawableAmount = newMonetaryAmount(1.337, WRAPPED_TOKEN, true);
  const hasActiveStrategy = maxWithdrawableAmount && !maxWithdrawableAmount.isZero();

  return (
    <StyledEarnStrategyForm>
      <Tabs fullWidth size='large'>
        {tabs.map(({ type, title }) => (
          <TabsItem key={type} title={title}>
            {type === 'deposit' ? (
              <EarnStrategyDepositForm key={type} riskVariant={riskVariant} hasActiveStrategy={hasActiveStrategy} />
            ) : (
              <EarnStrategyWithdrawalForm
                key={type}
                riskVariant={riskVariant}
                hasActiveStrategy={hasActiveStrategy}
                maxWithdrawableAmount={maxWithdrawableAmount}
              />
            )}
          </TabsItem>
        ))}
      </Tabs>
    </StyledEarnStrategyForm>
  );
};

export { EarnStrategyForm };
export type { EarnStrategyFormBaseProps, EarnStrategyFormProps };
