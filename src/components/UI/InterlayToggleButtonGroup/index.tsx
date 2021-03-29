
import {
  ToggleButton,
  ToggleButtonProps,
  ToggleButtonGroup,
  ToggleButtonGroupProps
} from 'react-bootstrap';

const InterlayToggleButtonGroup = (props: ToggleButtonGroupProps<number>) => (
  <ToggleButtonGroup {...props} />
);

const InterlayToggleButton = (props: ToggleButtonProps) => (
  <ToggleButton {...props} />
);

export {
  InterlayToggleButton
};

export type InterlayToggleButtonGroupProps = ToggleButtonGroupProps<number>;
export default InterlayToggleButtonGroup;
