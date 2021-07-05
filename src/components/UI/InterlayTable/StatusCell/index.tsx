
import { useTranslation } from 'react-i18next';
import {
  FaRegCheckCircle,
  FaRegClock,
  FaRegTimesCircle,
  FaUserClock,
  FaClipboardCheck
} from 'react-icons/fa';
import clsx from 'clsx';

interface Props {
  status: {
    completed: boolean;
    cancelled: boolean;
    isExpired: boolean;
    reimbursed: boolean;
  }
}

const StatusCell = ({
  status
}: Props): JSX.Element => {
  const { t } = useTranslation();

  // TODO: should double-check with the designer
  let icon;
  let notice;
  let colorClassName;
  switch (true) {
  case status.completed:
    icon = <FaRegCheckCircle />;
    notice = t('completed');
    colorClassName = 'text-interlayConifer';
    break;
  case status.cancelled:
    icon = <FaRegTimesCircle />;
    notice = t('cancelled');
    colorClassName = 'text-interlayCinnabar';
    break;
  case status.isExpired:
    icon = <FaUserClock />;
    notice = t('expired');
    colorClassName = 'text-interlayCinnabar';
    break;
  case status.reimbursed:
    icon = <FaClipboardCheck />;
    notice = t('reimbursed');
    colorClassName = 'text-interlayConifer';
    break;
  default:
    icon = <FaRegClock />;
    notice = t('pending');
    colorClassName = 'text-interlayCalifornia';
    break;
  }

  return (
    <div
      className={clsx(
        'inline-flex',
        'items-center',
        'space-x-1.5',
        colorClassName
      )}>
      {icon}
      <span>
        {notice}
      </span>
    </div>
  );
};

export default StatusCell;
