import { Flex, FlexProps } from '@/component-library/Flex';

type DlProps = FlexProps;

const Dl = (props: DlProps): JSX.Element => <Flex {...props} as='dl' />;

Dl.displayName = 'Dl';

export { Dl };
export type { DlProps };
