import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import ParachainSecurity from '../components/parachain-security';
import TimerIncrement from 'parts/TimerIncrement';
import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';

const Parachain = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <MainContainer className='fade-in-animation'>
      <div>
        <PageTitle
          mainTitle={t('dashboard.parachain.parachain')}
          subTitle={<TimerIncrement />} />
        <hr
          className={clsx(
            'border-interlayDenim',
            'mt-2'
          )} />
      </div>
      <div
        className={clsx(
          'grid',
          'grid-cols-2',
          'gap-7'
        )}>
        <ParachainSecurity />
      </div>
    </MainContainer>
  );
};

export default Parachain;
