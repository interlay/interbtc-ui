
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
        {/* ray test touch << */}
        <BalancesUI />
        {/* ray test touch >> */}
      </Panel>
    </MainContainer>
  );
};

export default Staking;
