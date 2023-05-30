import { DialogBody, DialogBodyProps } from '../Dialog';

type PopoverBodyProps = DialogBodyProps;

const PopoverBody = (props: PopoverBodyProps): JSX.Element => <DialogBody {...props} />;

export { PopoverBody };
export type { PopoverBodyProps };
