import clsx from 'clsx';

import { ReactComponent as InformationCircleIcon } from '@/assets/img/hero-icons/information-circle.svg';
import InterlayTooltip from '@/legacy-components/UI/InterlayTooltip';

interface Props {
  label: string;
  forDisabledAction?: boolean;
  className?: string;
}

const InformationTooltip = ({ label, forDisabledAction, className }: Props): JSX.Element => (
  <InterlayTooltip label={label}>
    <span>
      <InformationCircleIcon
        onClick={(event) => {
          forDisabledAction && event.stopPropagation();
        }}
        className={clsx('w-5', 'h-5', { 'pointer-events-auto': forDisabledAction }, className)}
      />
    </span>
  </InterlayTooltip>
);

export default InformationTooltip;
