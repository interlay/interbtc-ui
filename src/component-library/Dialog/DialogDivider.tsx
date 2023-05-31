import { DividerProps } from '../Divider';
import { StyledDialogDivider } from './Dialog.style';
import { useDialogContext } from './DialogContext';

type DialogDividerProps = Omit<DividerProps, 'orientation'>;

const DialogDivider = (props: DialogDividerProps): JSX.Element => {
  const { size } = useDialogContext();

  return <StyledDialogDivider orientation='horizontal' $size={size} {...props} />;
};

export { DialogDivider };
export type { DialogDividerProps };
