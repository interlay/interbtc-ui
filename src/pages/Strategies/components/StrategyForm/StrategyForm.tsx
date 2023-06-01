import { newMonetaryAmount } from '@interlay/interbtc-api';

import { Tabs, TabsItem } from '@/component-library';
import { WRAPPED_TOKEN } from '@/config/relay-chains';

import { StrategyFormType, StrategyRiskVariant } from '../../types/form';
import { StrategyDepositForm } from './StrategyDepositForm';
import { StyledStrategyForm } from './StrategyForm.style';
import { StrategyWithdrawalForm } from './StrategyWithdrawalForm';

interface StrategyFormProps {
  riskVariant: StrategyRiskVariant;
}

interface StrategyFormBaseProps extends StrategyFormProps {
  hasActiveStrategy: boolean | undefined;
}

type TabData = { type: StrategyFormType; title: string };

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

const StrategyForm = ({ riskVariant }: StrategyFormProps): JSX.Element => {
  // TODO: replace with actually withdrawable amount once we know how to get that information,
  // for now it's statically set for display purposes
  const maxWithdrawableAmount = newMonetaryAmount(1.337, WRAPPED_TOKEN, true);
  const hasActiveStrategy = maxWithdrawableAmount && !maxWithdrawableAmount.isZero();

  return (
    <StyledStrategyForm>
      <Tabs fullWidth size='large'>
        {tabs.map(({ type, title }) => (
          <TabsItem key={type} title={title}>
            {type === 'deposit' ? (
              <StrategyDepositForm key={type} riskVariant={riskVariant} hasActiveStrategy={hasActiveStrategy} />
            ) : (
              <StrategyWithdrawalForm
                key={type}
                riskVariant={riskVariant}
                hasActiveStrategy={hasActiveStrategy}
                maxWithdrawableAmount={maxWithdrawableAmount}
              />
            )}
          </TabsItem>
        ))}
      </Tabs>
    </StyledStrategyForm>
  );
};

export { StrategyForm };
export type { StrategyFormBaseProps, StrategyFormProps };
