import { DialogFooter, DialogFooterProps } from '../Dialog';

type PopoverFooterProps = DialogFooterProps;

const PopoverFooter = ({ justifyContent = 'flex-end', ...props }: PopoverFooterProps): JSX.Element => (
  <DialogFooter justifyContent={justifyContent} {...props} />
);

export { PopoverFooter };
export type { PopoverFooterProps };
