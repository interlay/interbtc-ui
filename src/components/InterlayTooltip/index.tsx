
import Tooltip from 'rc-tooltip';
import { TooltipProps } from 'rc-tooltip/lib/Tooltip';
import 'rc-tooltip/assets/bootstrap.css';

const InterlayTooltip = ({
  children,
  ...rest
}: TooltipProps) => (
  <Tooltip
    placement='top'
    {...rest}>
    {children}
  </Tooltip>
);

export default InterlayTooltip;
