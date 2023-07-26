import { Dl, DlProps } from '@/component-library';

type ApyDetailsProps = DlProps;

const ApyDetails = ({ direction = 'column', gap = 'spacing2', ...props }: ApyDetailsProps): JSX.Element => {
  return <Dl direction={direction} gap={gap} {...props} />;
};

export { ApyDetails };
export type { ApyDetailsProps };
