
import clsx from 'clsx';

import InterlayTooltip from 'components/UI/InterlayTooltip';
import { ReactComponent as InformationCircleIcon } from 'assets/img/hero-icons/information-circle.svg';

interface Props {
  tooltip: string;
  forDisabledAction?: boolean;
  className?: string;
}

const InformationTooltip = ({
  tooltip,
  forDisabledAction,
  className
}: Props): JSX.Element => (
  <InterlayTooltip label={tooltip}>
    <InformationCircleIcon
      onClick={event => {
        forDisabledAction && event.stopPropagation();
      }}
      className={clsx(
        'w-5',
        'h-5',
        { 'pointer-events-auto': forDisabledAction },
        className
      )} />
  </InterlayTooltip>
);

export default InformationTooltip;
