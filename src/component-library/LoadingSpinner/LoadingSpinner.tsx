import { BaseLoadingSpinner, BaseLoadingSpinnerProps } from './LoadingSpinner.style';

type LoadingSpinnerProps = BaseLoadingSpinnerProps & React.ComponentPropsWithRef<'span'>;

const LoadingSpinner = ({ diameter = 48, thickness = 10, ...rest }: LoadingSpinnerProps): JSX.Element => {
  return <BaseLoadingSpinner diameter={diameter} thickness={thickness} {...rest} />;
};

export { LoadingSpinner };
export type { LoadingSpinnerProps };
