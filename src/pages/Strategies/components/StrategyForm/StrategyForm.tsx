import { Card, CardProps, Tabs, TabsItem } from '@/component-library';

import { StrategyData } from '../../hooks/use-get-strategies';
import { StrategyPositionData } from '../../hooks/use-get-strategy-position';
import { StrategyDepositForm } from './StrategyDepositForm';
import { StrategyWithdrawalForm } from './StrategyWithdrawalForm';

type Props = {
  strategy: StrategyData;
  position?: StrategyPositionData;
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type StrategyFormProps = Props & InheritAttrs;

const StrategyForm = ({ strategy, position, ...props }: StrategyFormProps): JSX.Element => (
  <Card {...props}>
    <Tabs fullWidth size='large'>
      <TabsItem key='deposit' title='Deposit'>
        <StrategyDepositForm strategy={strategy} position={position} />
      </TabsItem>
      <TabsItem key='withdraw' title='Withdraw'>
        <StrategyWithdrawalForm strategy={strategy} position={position} />
      </TabsItem>
    </Tabs>
  </Card>
);

export { StrategyForm };
