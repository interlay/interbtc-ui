import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { FaClipboardCheck, FaRegCheckCircle, FaRegClock, FaRegTimesCircle, FaUserClock } from 'react-icons/fa';

import { getColorShade } from '@/utils/helpers/colors';

interface Props {
  status: {
    completed: boolean;
    cancelled: boolean;
    isExpired: boolean;
    reimbursed: boolean;
  };
}

const StatusCell = ({ status }: Props): JSX.Element => {
  const { t } = useTranslation();

  // TODO: should double-check with the designer
  let icon;
  let notice;
  let colorClassName;
  switch (true) {
    case status.completed:
      icon = <FaRegCheckCircle />;
      notice = t('completed');
      colorClassName = getColorShade('green');
      break;
    case status.cancelled:
      icon = <FaRegTimesCircle />;
      notice = t('cancelled');
      colorClassName = getColorShade('red');
      break;
    case status.isExpired:
      icon = <FaUserClock />;
      notice = t('expired');
      colorClassName = getColorShade('red');
      break;
    case status.reimbursed:
      icon = <FaClipboardCheck />;
      notice = t('reimbursed');
      colorClassName = getColorShade('green');
      break;
    default:
      icon = <FaRegClock />;
      notice = t('pending');
      colorClassName = getColorShade('yellow');
      break;
  }

  return (
    <div className={clsx('inline-flex', 'items-center', 'space-x-1.5', colorClassName)}>
      {icon}
      <span>{notice}</span>
    </div>
  );
};

export default StatusCell;
