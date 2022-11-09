import { Flex, FlexProps } from '@/component-library/Flex';

type DlProps = FlexProps;

const Dl = ({ gap = 'spacing4', as = 'dl', ...props }: DlProps): JSX.Element => <Flex gap={gap} as={as} {...props} />;

Dl.displayName = 'Dl';

export { Dl };
export type { DlProps };
