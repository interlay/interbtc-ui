import { BaseCheckCircleIcon } from './CheckCircleIcon.style';

type CheckCircleIconProps = React.ComponentPropsWithRef<'svg'>;

const CheckCircleIcon = (props: CheckCircleIconProps): JSX.Element => {
  return <BaseCheckCircleIcon {...props} />;
};

export { CheckCircleIcon };
export type { CheckCircleIconProps };
