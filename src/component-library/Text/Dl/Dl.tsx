import { Flex, FlexProps } from '@/component-library/Flex';

type DlProps = FlexProps;

const Dl = ({ gap = 'spacing4', elementType = 'dl', ...props }: DlProps): JSX.Element => (
  <Flex gap={gap} elementType={elementType} {...props} />
);

Dl.displayName = 'Dl';

export { Dl };
export type { DlProps };
