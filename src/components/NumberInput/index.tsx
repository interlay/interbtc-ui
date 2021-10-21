
import * as React from 'react';
import InterlayInput, { Props as InterlayInputProps } from 'components/UI/InterlayInput';

type Ref = HTMLInputElement;
const NumberInput = React.forwardRef<Ref, InterlayInputProps>((props, ref): JSX.Element => (
  <InterlayInput
    ref={ref}
    type='number'
    step='any'
    pattern='[-+]?[0-9]*[.,]?[0-9]+'
    placeholder='0.00'
    spellCheck='false'
    {...props} />
));
NumberInput.displayName = 'NumberInput';

export type Props = InterlayInputProps;

export default NumberInput;
