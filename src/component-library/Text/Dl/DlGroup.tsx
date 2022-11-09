import { Flex, FlexProps } from '@/component-library/Flex';

type DlGroupProps = FlexProps;

const DlGroup = ({
  direction = 'row',
  alignItems = 'center',
  gap = 'spacing4',
  ...props
}: DlGroupProps): JSX.Element => <Flex direction={direction} alignItems={alignItems} gap={gap} {...props} />;

DlGroup.displayName = 'DlGroup';

export { DlGroup };
export type { DlGroupProps };
