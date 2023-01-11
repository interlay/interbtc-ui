import { FlexProps } from '../Flex';
import { Overflow } from '../utils/prop-types';
import { StyledModalBody } from './Modal.style';

type Props = {
  overflow?: Overflow;
  noPadding?: boolean;
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type ModalBodyProps = Props & InheritAttrs;

const ModalBody = ({ overflow = 'auto', noPadding, direction = 'column', ...props }: ModalBodyProps): JSX.Element => (
  <StyledModalBody {...props} $overflow={overflow} $noPadding={noPadding} direction={direction} />
);

export { ModalBody };
export type { ModalBodyProps };
