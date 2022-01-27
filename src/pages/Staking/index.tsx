
import clsx from 'clsx';

import Title from './Title';
import BalancesUI from './BalancesUI';
import UnstakeButton from './UnstakeButton';
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
          'p-8',
          'space-y-8'
        )}>
        <Title />
        <BalancesUI />
        <UnstakeButton />
      </Panel>
    </MainContainer>
  );
};

export default Staking;
