import clsx from 'clsx';

import TransferForm from './TransferForm';
import MainContainer from 'parts/MainContainer';
import Panel from 'components/Panel';

const Transfer = (): JSX.Element | null => {
  return (
    <MainContainer>
      <Panel className={clsx('mx-auto', 'w-full', 'md:max-w-xl', 'p-10')}>
        <TransferForm />
      </Panel>
    </MainContainer>
  );
};

export default Transfer;
