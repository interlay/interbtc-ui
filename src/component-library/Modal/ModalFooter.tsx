import { Stack, StackProps } from '../Stack';

type InheritAttrs = StackProps;

type ModalFooterProps = InheritAttrs;

const ModalFooter = (props: ModalFooterProps): JSX.Element => <Stack {...props} />;

export { ModalFooter };
export type { ModalFooterProps };
