import { DialogBodyProps } from '../Dialog';
import { Overflow } from '../utils/prop-types';
import { StyledDialogBody } from './Modal.style';
import { useModalContext } from './ModalContext';

type Props = {
  overflow?: Overflow;
  noPadding?: boolean;
};

type InheritAttrs = Omit<DialogBodyProps, keyof Props>;

type ModalBodyProps = Props & InheritAttrs;

const ModalBody = ({ overflow, noPadding, ...props }: ModalBodyProps): JSX.Element => {
  const { bodyProps } = useModalContext();

  return <StyledDialogBody {...props} $overflow={overflow || bodyProps?.overflow} $noPadding={noPadding} />;
};

export { ModalBody };
export type { ModalBodyProps };
