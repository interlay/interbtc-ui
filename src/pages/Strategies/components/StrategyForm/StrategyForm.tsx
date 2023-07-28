import { Card, CardProps, Tabs, TabsItem } from '@/component-library';

import { StrategyType } from '../../types';
import { StrategyDepositForm } from '../StrategyDepositForm';
import { StrategyWithdrawalForm } from '../StrategyWithdrawalForm';

type Props = {
  type: StrategyType;
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type StrategyFormProps = Props & InheritAttrs;

const StrategyForm = ({ type, ...props }: StrategyFormProps): JSX.Element => (
  <Card {...props}>
    <Tabs fullWidth size='large'>
      <TabsItem key='deposit' title='Deposit'>
        <StrategyDepositForm type={type} />
      </TabsItem>
      <TabsItem key='withdraw' title='Withdraw'>
        <StrategyWithdrawalForm type={type} />
      </TabsItem>
    </Tabs>
  </Card>
);

export { StrategyForm };
