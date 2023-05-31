import { FlexProps } from '../Flex';
import { StyledDialogFooter } from './Dialog.style';
import { useDialogContext } from './DialogContext';

type InheritAttrs = FlexProps;

type DialogFooterProps = InheritAttrs;

const DialogFooter = (props: DialogFooterProps): JSX.Element => {
  const { size } = useDialogContext();

  return <StyledDialogFooter $size={size} {...props} />;
};

export { DialogFooter };
export type { DialogFooterProps };
