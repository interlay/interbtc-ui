
import InterlayInput, { Props as InterlayInputProps } from 'components/UI/InterlayInput';

const NumberInput = (props: InterlayInputProps): JSX.Element => (
  <InterlayInput
    type='number'
    step='any'
    pattern='[-+]?[0-9]*[.,]?[0-9]+'
    placeholder='0.00'
    spellCheck='false'
    {...props} />
);

export default NumberInput;
