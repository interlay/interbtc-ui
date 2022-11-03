import { Flex, FlexProps } from '@/component-library/Flex';

type DlGroupProps = FlexProps;

const DlGroup = ({ direction = 'row', alignItems = 'center', ...props }: DlGroupProps): JSX.Element => (
  <Flex direction={direction} alignItems={alignItems} {...props} />
);

DlGroup.displayName = 'DlGroup';

export { DlGroup };
export type { DlGroupProps };
