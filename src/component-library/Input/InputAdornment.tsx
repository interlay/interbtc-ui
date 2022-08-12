import { Adornment } from './Input.style';

type NativeAttrs = React.HTMLAttributes<unknown>;

type InputAdornmentProps = NativeAttrs;

const InputAdornment = (props: InputAdornmentProps): JSX.Element => <Adornment {...props} />;

export { InputAdornment };
export type { InputAdornmentProps };
