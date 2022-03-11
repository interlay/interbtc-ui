
import clsx from 'clsx';

import InterlayTooltip from 'components/UI/InterlayTooltip';
import { ReactComponent as InformationCircleIcon } from 'assets/img/hero-icons/information-circle.svg';

interface Props {
  tooltip: string;
  forDisabledAction?: boolean;
}

const InformationTooltip = ({
  tooltip,
  forDisabledAction
}: Props): JSX.Element => (
  <InterlayTooltip label={tooltip}>
    <InformationCircleIcon
      onClick={event => {
        forDisabledAction && event.stopPropagation();
      }}
      className={clsx(
        'w-5',
        'h-5',
        { 'pointer-events-auto': forDisabledAction }
      )} />
  </InterlayTooltip>
);

export default InformationTooltip;
