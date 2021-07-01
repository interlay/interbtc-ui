
// ray test touch <<
import {
  ToggleButton,
  ToggleButtonProps,
  ToggleButtonGroup,
  ToggleButtonGroupProps
} from 'react-bootstrap';

const InterlayToggleButtonGroup = (props: ToggleButtonGroupProps<number>): JSX.Element => (
  <ToggleButtonGroup {...props} />
);

const InterlayToggleButton = (props: ToggleButtonProps): JSX.Element => (
  <ToggleButton {...props} />
);

export {
  InterlayToggleButton
};

export type InterlayToggleButtonGroupProps = ToggleButtonGroupProps<number>;
export default InterlayToggleButtonGroup;
// ray test touch >>
