
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import InterlayLink from 'components/UI/InterlayLink';
import { formatDateTime } from 'common/utils/utils';

interface Message {
  id: number;
  startTime: Date;
  endTime: Date;
  type: string;
  reason: string;
  link: string;
}

// TODO: make this easily modifiable by having a list of maintenance elements somewhere else
const MaintenanceBanner = (): JSX.Element | null => {
  const { t } = useTranslation();
  const now = Date.now();

  const maintenanceWindows: Array<Message> = [
    {
      id: 1,
      startTime: new Date(1616684400000), // Thu Mar 25 2021 15:00:00 GMT+0000
      endTime: new Date(1616698800000), // Thu Mar 25 2021 19:00:00 GMT+0000
      type: t('maintenance.type.scheduled'),
      reason: t('maintenance.reason.chain'),
      link: 'https://medium.com/interlay/polkabtc-beta-scheduled-maintenance-25-march-3pm-gmt-509b36f73479'
    }
  ];

  const validItems = maintenanceWindows.filter(
    maintenanceWindow => now < maintenanceWindow.endTime.getTime()
  );

  if (validItems.length <= 0) {
    return null;
  }

  return (
    <ul
      className={clsx(
        'my-4',
        'space-y-4'
      )}>
      {validItems.map(item => (
        <li
          key={item.id}
          className={clsx(
            'px-5',
            'py-3',
            'md:mx-auto',
            'md:max-w-3xl',
            'border',
            'border-solid',
            'border-interlayPaleSky',
            'rounded',
            'text-center'
          )}>
          <strong className='text-interlayPaleSky'>
            {`${item.type} ${formatDateTime(item.startTime)}: ${item.reason}`}
            &nbsp;
            <InterlayLink
              href={item.link}
              target='_blank'
              rel='noopener noreferrer'>
              {t('maintenance.info')}
            </InterlayLink>
          </strong>
        </li>
      ))}
    </ul>
  );
};

export default MaintenanceBanner;
