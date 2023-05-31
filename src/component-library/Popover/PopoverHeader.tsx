import { DialogHeader, DialogHeaderProps } from '../Dialog';

type PopoverHeaderProps = DialogHeaderProps;

const PopoverHeader = ({ size = 'base', weight = 'semibold', children, ...props }: PopoverHeaderProps): JSX.Element => (
  <DialogHeader size={size} weight={weight} {...props}>
    {children}
  </DialogHeader>
);

export { PopoverHeader };
export type { PopoverHeaderProps };
