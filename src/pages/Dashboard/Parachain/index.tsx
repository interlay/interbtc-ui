import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import ParachainSecurity from '../ParachainSecurity';
import TimerIncrement from 'parts/TimerIncrement';
import PageTitle from 'parts/PageTitle';
import Hr1 from 'components/hrs/Hr1';

const Parachain = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <PageTitle
          mainTitle={t('dashboard.parachain.parachain')}
          subTitle={<TimerIncrement />} />
        <Hr1 className='mt-2' />
      </div>
      <div
        className={clsx(
          'grid',
          'grid-cols-2',
          'gap-7'
        )}>
        <ParachainSecurity />
      </div>
    </>
  );
};

export default Parachain;
