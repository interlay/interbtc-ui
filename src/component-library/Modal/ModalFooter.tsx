import { FlexProps } from '../Flex';
import { StyledModalFooter } from './Modal.style';

type InheritAttrs = FlexProps;

type ModalFooterProps = InheritAttrs;

const ModalFooter = ({ direction = 'column', gap = 'spacing4', ...props }: ModalFooterProps): JSX.Element => (
  <StyledModalFooter {...props} direction={direction} gap={gap} />
);

export { ModalFooter };
export type { ModalFooterProps };
