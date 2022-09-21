import { StackProps } from '../Stack';
import { StyledModalBody } from './Modal.style';

type InheritAttrs = StackProps;

type ModalBodyProps = InheritAttrs;

const ModalBody = (props: ModalBodyProps): JSX.Element => <StyledModalBody {...props} />;

export { ModalBody };
export type { ModalBodyProps };
