import { Tabs, TabsItem } from '@/component-library';

import { StrategyFormProps, StrategyFormType } from '../../types/form';
import { StrategyDepositForm } from '../StrategyDepositForm';
import { StrategyWithdrawalForm } from '../StrategyWithdrawalForm';
import { StyledStrategyForm } from './StrategyForm.style';

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

const StrategyForm = ({ strategyType }: StrategyFormProps): JSX.Element => {
  return (
    <StyledStrategyForm>
      <Tabs fullWidth size='large'>
        {tabs.map(({ type, title }) => (
          <TabsItem key={type} title={title}>
            {type === 'deposit' ? (
              <StrategyDepositForm key={type} strategyType={strategyType} />
            ) : (
              <StrategyWithdrawalForm key={type} strategyType={strategyType} />
            )}
          </TabsItem>
        ))}
      </Tabs>
    </StyledStrategyForm>
  );
};

export { StrategyForm };
