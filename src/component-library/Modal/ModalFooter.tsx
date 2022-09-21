import { StackProps } from '../Stack';
import { StyledModalFooter } from './Modal.style';

type InheritAttrs = StackProps;

type ModalFooterProps = InheritAttrs;

const ModalFooter = (props: ModalFooterProps): JSX.Element => <StyledModalFooter {...props} />;

export { ModalFooter };
export type { ModalFooterProps };
