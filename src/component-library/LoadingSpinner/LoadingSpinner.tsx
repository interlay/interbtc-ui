// ray test touch <
import { BaseLoadingSpinner } from './LoadingSpinner.style';

type LoadingSpinnerProps = React.ComponentPropsWithRef<'span'>;

const LoadingSpinner = (props: LoadingSpinnerProps): JSX.Element => {
  return <BaseLoadingSpinner {...props} />;
};

export { LoadingSpinner };
export type { LoadingSpinnerProps };
// ray test touch >
