import { FlexProps } from '../Flex';
import { Overflow } from '../utils/prop-types';
import { StyledModalBody } from './Modal.style';
import { useModalContext } from './ModalContext';

type Props = {
  overflow?: Overflow;
  noPadding?: boolean;
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type ModalBodyProps = Props & InheritAttrs;

const ModalBody = ({ overflow, noPadding, direction = 'column', ...props }: ModalBodyProps): JSX.Element => {
  const { bodyProps } = useModalContext();

  return (
    <StyledModalBody
      {...props}
      $overflow={overflow || bodyProps?.overflow}
      $noPadding={noPadding}
      direction={direction}
    />
  );
};

export { ModalBody };
export type { ModalBodyProps };
