
// TODO: could use tailwindcss
import RCTooltip from 'rc-tooltip';
import { TooltipProps as RCTooltipProps } from 'rc-tooltip/lib/Tooltip';
import 'rc-tooltip/assets/bootstrap.css';

const Tooltip = ({
  children,
  ...rest
}: Props): JSX.Element => (
  <RCTooltip
    placement='top'
    {...rest}>
    {children}
  </RCTooltip>
);

export type Props = RCTooltipProps;

export default Tooltip;
