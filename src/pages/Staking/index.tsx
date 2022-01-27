
import clsx from 'clsx';

import Title from './Title';
import BalancesUI from './BalancesUI';
import MainContainer from 'parts/MainContainer';
import Panel from 'components/Panel';

const Staking = (): JSX.Element => {
  return (
    <MainContainer>
      <Panel
        className={clsx(
          'mx-auto',
          'w-full',
          'md:max-w-xl',
          'p-10'
        )}>
        <Title />
        <BalancesUI />
      </Panel>
    </MainContainer>
  );
};

export default Staking;
