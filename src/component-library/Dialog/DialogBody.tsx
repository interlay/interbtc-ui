import { FlexProps } from '../Flex';
import { StyledDialogBody } from './Dialog.style';
import { useDialogContext } from './DialogContext';

type DialogBodyProps = FlexProps;

const DialogBody = ({ direction = 'column', ...props }: DialogBodyProps): JSX.Element => {
  const { size } = useDialogContext();

  return <StyledDialogBody {...props} $size={size} direction={direction} />;
};

export { DialogBody };
export type { DialogBodyProps };
