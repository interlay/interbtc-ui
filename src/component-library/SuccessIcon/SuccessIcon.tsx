import { BaseSuccessIcon } from './SuccessIcon.style';

type SuccessIconProps = React.ComponentPropsWithRef<'svg'>;

const SuccessIcon = (props: SuccessIconProps): JSX.Element => {
  return <BaseSuccessIcon {...props} />;
};

export { SuccessIcon };
export type { SuccessIconProps };
