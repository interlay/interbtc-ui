
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { formatDateTime } from 'common/utils/utils';
import InterlayLink from 'components/InterlayLink';

interface Message {
  startTime: Date;
  endTime: Date;
  type: string;
  reason: string;
  link: string;
}

// TODO: make this easily modifiable by having a list of maintenance elements somewhere else
function MaintenanceBanner() {
  const { t } = useTranslation();
  const now = Date.now();

  const maintenanceWindows: Array<Message> = [
    {
      startTime: new Date(1616684400000), // Thu Mar 25 2021 15:00:00 GMT+0000
      endTime: new Date(1616698800000), // Thu Mar 25 2021 19:00:00 GMT+0000
      type: t('maintenance.type.scheduled'),
      reason: t('maintenance.reason.chain'),
      link: 'https://medium.com/interlay/polkabtc-beta-scheduled-maintenance-25-march-3pm-gmt-509b36f73479'
    }
  ];

  return (
    <div>
      {maintenanceWindows.map(maintenance => {
        if (now < Number(maintenance.endTime)) {
          return (
            <div
              className={clsx(
                'px-5',
                'py-3',
                'm-4',
                'sm:mx-auto',
                'md:max-w-3xl',
                'border',
                'border-solid',
                'border-interlayGrey',
                'rounded',
                'text-center'
              )}>
              <strong className='text-interlayGrey'>
                {`${maintenance.type} ${formatDateTime(maintenance.startTime)}: ${maintenance.reason} `}
                <InterlayLink
                  href={maintenance.link}
                  target='_blank'
                  rel='noopener noreferrer'>
                  {t('maintenance.info')}
                </InterlayLink>
              </strong>
            </div>
          );
        } else {
          return (
            <div></div>
          );
        }
      })}
    </div>
  );
}

export default MaintenanceBanner;
