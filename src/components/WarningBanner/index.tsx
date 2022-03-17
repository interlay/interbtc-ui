
// ray test touch <<
import clsx from 'clsx';

import Panel from 'components/Panel';
import { ReactComponent as InformationCircleIcon } from 'assets/img/hero-icons/information-circle.svg';

interface Props {
  message: string;
}

const WarningBanner = ({
  message
}: Props): JSX.Element => {
  return (
    <Panel
      className={clsx(
        'mx-auto',
        'text-center',
        'w-full',
        'p-4',
        'md:max-w-2xl',
        'justify-between',
        'flex',
        'dark:bg-kintsugiThunderbird'
      )}>
      <InformationCircleIcon
        className={clsx(
          'w-5',
          'h-5'
        )} />
      <p>{message}</p>
    </Panel>
  );
};

export default WarningBanner;
// ray test touch >>
